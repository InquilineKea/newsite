#!/usr/bin/env python3
"""Offline native-artifact integration demo. Synthetic log-expression, not RNA-seq DE inference."""
import argparse
import hashlib
import importlib.util
import json
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scienceclaw-root', required=True, help='Checkout containing native artifacts/artifact.py. No upstream code is downloaded or executed automatically.')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    import numpy as np
    import scipy
    from scipy.linalg import lstsq
    from scienceclaw_bridge import prepare_record
    source = Path(args.scienceclaw_root).resolve() / 'artifacts' / 'artifact.py'
    spec = importlib.util.spec_from_file_location('scienceclaw_native_artifact_demo', source)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    Artifact = module.Artifact
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    n, seed = 240, 42

    def data(run_seed):
        rng = np.random.default_rng(run_seed)
        condition = np.repeat([0., 1.], n // 2)
        maturity = .9 * condition + rng.normal(0., .5, n)
        lane = rng.binomial(1, .25 + .45 * condition)
        expression = 4. - 1.3 * maturity + .3 * lane + rng.normal(0., .25, n)
        return condition, maturity, lane, expression

    condition, maturity, lane, y = data(seed)
    naive_x = np.column_stack([np.ones(n), condition])
    full_x = np.column_stack([np.ones(n), condition, maturity, lane])
    naive_beta = np.linalg.lstsq(naive_x, y, rcond=None)[0]
    adjusted_beta = np.linalg.lstsq(full_x, y, rcond=None)[0]
    # Independent algebraic check: residualize both response and group indicator
    # against the nuisance design, then fit the residual association (FWL).
    nuisance = np.column_stack([np.ones(n), maturity, lane])
    residual_y = y - nuisance @ lstsq(nuisance, y)[0]
    residual_condition = condition - nuisance @ lstsq(nuisance, condition)[0]
    residual_beta = float(residual_condition @ residual_y / (residual_condition @ residual_condition))
    rng = np.random.default_rng(seed + 1)
    bootstrap = []
    for _ in range(200):
        idx = rng.integers(0, n, n)
        bootstrap.append(float(np.linalg.lstsq(full_x[idx], y[idx], rcond=None)[0][1]))
    replicated = []
    for run_seed in range(100, 120):
        c, m, l, outcome = data(run_seed)
        replicated.append(float(np.linalg.lstsq(np.column_stack([np.ones(n), c, m, l]), outcome, rcond=None)[0][1]))
    interval = [float(x) for x in np.quantile(bootstrap, [.025, .975])]
    checks = {
        'known_direct_condition_effect': 0.,
        'naive_condition_coefficient': float(naive_beta[1]),
        'adjusted_condition_coefficient': float(adjusted_beta[1]),
        'residualization_coefficient': residual_beta,
        'algebraic_agreement_absolute_error': abs(float(adjusted_beta[1]) - residual_beta),
        'adjusted_bootstrap_95_percent_interval': interval,
        'mean_adjusted_coefficient_over_20_seeds': float(np.mean(replicated)),
        'condition_maturity_correlation': float(np.corrcoef(condition, maturity)[0, 1]),
        'design_rank': int(np.linalg.matrix_rank(full_x)),
    }
    assert abs(checks['naive_condition_coefficient']) > .7
    assert abs(checks['adjusted_condition_coefficient']) < .2
    assert checks['algebraic_agreement_absolute_error'] < 1e-10
    assert abs(checks['mean_adjusted_coefficient_over_20_seeds']) < .06
    artifacts = []

    def emit(agent, kind, skill, payload, parents=(), needs=None, summary=''):
        a = Artifact.create(artifact_type=kind, producer_agent=agent, skill_used=skill, payload=payload, investigation_id='synthetic-confounding-integration-demo', parent_artifact_ids=list(parents), needs=needs or [], summary=summary)
        record = a.to_dict()
        prepare_record(record)  # Verify the bridge accepts exact native serialization.
        artifacts.append(record)
        return a.artifact_id

    root = emit('SyntheticData', 'tabular_data', 'synthetic_generator', {'seed': seed, 'n': n, 'true_direct_condition_effect': 0., 'columns': ['condition', 'maturity', 'lane', 'log_expression'], 'rows': np.column_stack([condition, maturity, lane, y]).tolist()}, summary='Synthetic data with condition-maturity confounding and no direct condition effect.')
    naive = emit('UnadjustedModel', 'analysis_result', 'synthetic_linear_regression', {'design': 'log_expression ~ condition', 'condition_coefficient': checks['naive_condition_coefficient'], 'limitation': 'Unadjusted association mixes condition with maturity and lane.'}, [root], [{'artifact_type': 'analysis_result', 'query': 'separate condition association from maturity and lane in the synthetic data', 'rationale': 'The unadjusted result may be driven by deliberately correlated nuisance variables.', 'branch': True, 'max_variants': 2, 'preferred_skills': ['synthetic_linear_regression'], 'param_variants': []}], summary='Unadjusted association is negative; its attribution remains unresolved.')
    adjusted = emit('ConfoundingAudit', 'analysis_result', 'synthetic_linear_regression', {'design': 'log_expression ~ condition + maturity + lane', 'condition_coefficient': checks['adjusted_condition_coefficient'], 'interpretation': 'Conditional association is near the known zero direct effect in this synthetic generator. This is not evidence about any real gene.'}, [root, naive], summary='Recorded covariates substantially change the apparent condition association.')
    evaluation = emit('ReplicationCheck', 'peer_validation', 'algebra_and_repeated_seed_check', {'checks': checks, 'bootstrap_replicates': 200, 'replication_seeds': list(range(100, 120)), 'limitation': 'These checks share the known synthetic generator and therefore are not independent biological replication.'}, [root, naive, adjusted], summary='Residualization and repeated-seed checks agree with the adjusted estimate.')
    emit('EvidenceSynthesis', 'synthesis', 'provenance_summary', {'conclusion': 'The naive and adjusted answers estimate different contrasts. Interpret both with their explicit design and the generator’s known confounding structure.', 'scope': 'Synthetic integration demonstration only; no LLM agents or experimental biological data.', 'preserve_disagreement': [naive, adjusted]}, [naive, adjusted, evaluation], summary='Methodological disagreement remains visible with typed parent lineage.')
    with (output / 'artifacts.jsonl').open('w', encoding='utf-8') as handle:
        for record in artifacts:
            handle.write(json.dumps(record, ensure_ascii=False) + '\n')
    summary = {'kind': 'synthetic-native-artifact-integration', 'scienceclaw_contract': 'Artifact 1.0', 'reference_commit': 'ab9aba130200e0a7dd4c76dca5cf945169f8c44a', 'native_source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'seed': seed, 'n': n, 'numpy': np.__version__, 'scipy': scipy.__version__, 'checks': checks, 'native_artifacts_created': len(artifacts), 'all_native_hashes_verified': True, 'models_launched': 0, 'external_publications': 0, 'limitation': 'Scripted scientific workflow, not a multi-LLM investigation or RNA-seq differential-expression analysis.'}
    (output / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
