#!/usr/bin/env python3
"""Reproduce a finite, idealized three-port scattering audit. NumPy only.

Conventions: H[target, source]; bonds 0->1->2->0 carry exp(+i phi/3).
Units: hbar=1, hopping t=1 unless specified. Port waves have unit flux.
G^r=(E I-H+i gamma I/2)^-1; S=I-i gamma G^r; T[a,b]=|S[a,b]|^2.
Positive C below means routing 0->1->2->0, not positive bond phase.
"""
import argparse
import itertools
import json
from pathlib import Path
import numpy as np

TOL = 1e-11


def triangle(phi, t=1.0, onsite=(0.0, 0.0, 0.0)):
    h = np.diag(np.asarray(onsite, dtype=complex))
    for source in range(3):
        target = (source + 1) % 3
        h[target, source] = t * np.exp(1j * phi / 3)
        h[source, target] = np.conj(h[target, source])
    return h


def scatter(h, energy=0.0, gamma=2.0):
    if gamma <= 0:
        raise ValueError('gamma must be positive')
    if np.max(np.abs(h - h.conj().T)) > TOL:
        raise ValueError('Hamiltonian must be Hermitian')
    eye = np.eye(3)
    g = np.linalg.solve(energy * eye - h + 0.5j * gamma * eye, eye)
    s = eye - 1j * gamma * g
    return s, np.abs(s) ** 2


def circulation(t):
    return float(sum(t[(j + 1) % 3, j] - t[(j - 1) % 3, j] for j in range(3)) / 3)


def error(a, b):
    return float(np.max(np.abs(np.asarray(a) - np.asarray(b))))


def clean(a):
    return np.round(np.asarray(a), 14).tolist()


def eig_residual(h):
    values, vectors = np.linalg.eigh(h)
    return error(h @ vectors, vectors * values)


def make_audit():
    phi = np.pi / 2
    hplus, hminus = triangle(phi), triangle(-phi)
    sp, tp = scatter(hplus)
    sm, tm = scatter(hminus)
    theta = np.array([0.31, -0.78, 1.19])
    d = np.diag(np.exp(1j * theta))
    hg = d @ hplus @ d.conj().T
    sg, tg = scatter(hg)
    szero, tzero = scatter(triangle(0.0))
    checks = {}
    def check(name, residual, description):
        passed = bool(residual < TOL)
        checks[name] = {'pass': passed, 'max_absolute_error': float(residual), 'description': description}
        assert passed, (name, residual)
    check('hermiticity', error(hplus, hplus.conj().T), 'Each reverse bond is the conjugate of its forward bond.')
    check('opposite_flux_same_spectrum', error(np.linalg.eigvalsh(hplus), np.linalg.eigvalsh(hminus)), 'Entrywise conjugate Hermitian matrices have identical real spectra.')
    check('analytic_spectrum', error(np.linalg.eigvalsh(hplus), [-np.sqrt(3), 0, np.sqrt(3)]), 'Exact pi/2-flux spectrum at t=1, zero onsite energies.')
    check('positive_flux_circulator', error(tp, [[0,1,0],[0,0,1],[1,0,0]]), 'Rows are output ports; columns are input ports.')
    check('negative_flux_circulator', error(tm, tp.T), 'Opposite flux reverses routing with physical port labels held fixed.')
    check('onsager_transpose_amplitude', error(sm, sp.T), 'S(-phi)=S(phi)^T under the stated real equal-port coupling convention.')
    check('gauge_covariance_amplitude', error(sg, d @ sp @ d.conj().T), 'Diagonal site gauge induces channel phase changes.')
    check('gauge_invariance_probability', error(tg, tp), 'Intensity routing does not depend on site/channel phase conventions.')
    check('gauge_invariance_eigenspectrum', error(np.linalg.eigvalsh(hg), np.linalg.eigvalsh(hplus)), 'A diagonal unitary conjugation preserves eigenvalues.')
    # Product uses hopping amplitudes along the directed cycle, not H[0,1]H[1,2]H[2,0].
    loop = lambda h: h[1,0] * h[2,1] * h[0,2]
    check('wilson_loop_gauge_invariance', abs(loop(hplus) - loop(hg)), 'Oriented loop product is t^3 exp(i phi); phases cancel under gauge.')
    check('wilson_loop_flux', abs(loop(hplus) - np.exp(1j * phi)), 'phi is the net oriented loop phase modulo 2pi.')
    check('zero_flux_reciprocity_amplitude', error(szero, szero.T), 'Real symmetric H at zero flux gives reciprocal S.')
    check('zero_flux_reciprocity_probability', error(tzero, tzero.T), 'Zero-flux routing is reciprocal.')
    check('unitarity', error(sp.conj().T @ sp, np.eye(3)), 'No internal loss/gain and all three wide-band ports retained.')
    check('input_probability_conservation', error(tp.sum(axis=0), np.ones(3)), 'Each normalized incoming channel scatters with total probability one.')
    check('output_probability_conservation', error(tp.sum(axis=1), np.ones(3)), 'Unitarity also makes T row sums one.')
    check('eigenpair_residual_plus', eig_residual(hplus), 'H v=lambda v residual.')
    check('eigenpair_residual_minus', eig_residual(hminus), 'H v=lambda v residual.')
    perr = 0.0
    for perm in itertools.permutations(range(3)):
        p = np.eye(3)[list(perm)]
        sperm, tperm = scatter(p @ hplus @ p.T)
        perr = max(perr, error(sperm, p @ sp @ p.T), error(tperm, p @ tp @ p.T))
    check('all_six_permutation_covariances', perr, 'Relabel the Hamiltonian and ports together; compare in the same labels.')
    reflection = np.eye(3)[[0,2,1]]
    check('opposite_flux_unlabelled_equivalence', error(hminus, reflection @ hplus @ reflection.T), 'The opposite-flux triangles are the same unlabelled system under reflection.')
    check('reflected_routing_equivalence', error(tm, reflection @ tp @ reflection.T), 'Fixed-port routing differs; relabelled routing agrees.')
    # Distinct onsite energies break the symmetric triangle's reflection equivalence.
    # A gauge cannot change onsite values. Any permutation matching both diagonals
    # must then be the identity; its nonzero loop flux still cannot be conjugated away.
    detuning = [0.0, 0.2, -0.35]
    hdplus, hdminus = triangle(phi, onsite=detuning), triangle(-phi, onsite=detuning)
    sdplus, tdplus = scatter(hdplus)
    sdminus, tdminus = scatter(hdminus)
    check('detuned_opposite_flux_spectrum', error(np.linalg.eigvalsh(hdplus), np.linalg.eigvalsh(hdminus)), 'Distinct real onsite energies preserve conjugate-pair isospectrality.')
    check('detuned_opposite_flux_transpose', error(sdminus, sdplus.T), 'Same physical labelled onsite arrangement, reversed flux.')
    matching_permutations = []
    for perm in itertools.permutations(range(3)):
        p = np.eye(3)[list(perm)]
        if error(np.diag(hdminus), np.diag(p @ hdplus @ p.T)) < TOL:
            matching_permutations.append(list(perm))
    assert matching_permutations == [[0,1,2]]
    detuned_loop_distance = abs(loop(hdplus) - loop(hdminus))
    assert detuned_loop_distance > 1.9
    def canonical_loop(h):
        # Define an orientation by increasing distinct onsite values. Relabelling
        # permutes sites but this scalar stays fixed; diagonal gauges cancel.
        a,b,c = np.argsort(np.real(np.diag(h)))
        return h[b,a] * h[c,b] * h[a,c]
    canon_error = 0.0
    for perm in itertools.permutations(range(3)):
        p = np.eye(3)[list(perm)]
        canon_error = max(canon_error, abs(canonical_loop(p @ hdplus @ p.T)-canonical_loop(hdplus)))
    check('detuned_canonical_flux_permutation_invariance', canon_error, 'Unique onsite values canonically orient the cycle; all six relabellings preserve this invariant.')
    check('detuned_canonical_flux_gauge_invariance', abs(canonical_loop(d @ hdplus @ d.conj().T)-canonical_loop(hdplus)), 'Diagonal gauges preserve the onsite-ordered cycle product.')
    # Test broader parameters so exact ideal point alone cannot conceal sign or normalization bugs.
    max_u = max_r = max_s = max_g = 0.0
    rng = np.random.default_rng(2718)
    for _ in range(40):
        angle = rng.uniform(-np.pi, np.pi)
        energy = rng.uniform(-2, 2)
        gamma = rng.uniform(0.2, 4)
        onsite = rng.uniform(-0.4, 0.4, size=3)
        hp = triangle(angle, onsite=onsite)
        hm = triangle(-angle, onsite=onsite)
        a, ta = scatter(hp, energy, gamma)
        b, tb = scatter(hm, energy, gamma)
        dd = np.diag(np.exp(1j * rng.uniform(-np.pi, np.pi, size=3)))
        ag, tag = scatter(dd @ hp @ dd.conj().T, energy, gamma)
        max_u = max(max_u, error(a.conj().T @ a, np.eye(3)))
        max_r = max(max_r, error(b, a.T))
        max_s = max(max_s, error(np.linalg.eigvalsh(hp), np.linalg.eigvalsh(hm)))
        max_g = max(max_g, error(tag, ta))
    check('randomized_unitarity_40', max_u, 'Random energy, leakage, flux and real onsite detunings; deterministic seed 2718.')
    check('randomized_opposite_flux_transpose_40', max_r, 'Transpose relation survives real onsite detuning.')
    check('randomized_opposite_flux_isospectral_40', max_s, 'Conjugate-pair isospectrality survives real onsite detuning.')
    check('randomized_gauge_invariance_40', max_g, 'Intensity invariance survives randomized phase choices and detunings.')
    # Deliberately incorrect implementations must be visibly rejected.
    bad_g = np.linalg.inv(-hplus + 2j * np.eye(3))  # wrong: uses gamma instead of gamma/2
    bad_s = np.eye(3) - 2j * bad_g
    bad_unitarity = error(bad_s.conj().T @ bad_s, np.eye(3))
    assert bad_unitarity > 0.1
    bad_h = hplus.copy(); bad_h[0,1] = bad_h[1,0]
    rejected = False
    try:
        scatter(bad_h)
    except ValueError:
        rejected = True
    assert rejected
    fixed_label_distance = float(np.linalg.norm(tp-tm))
    assert fixed_label_distance > 2
    # This is a deterministic screened toy grid, not quality-diversity discovery or a materials simulation.
    grid = []
    for angle, energy, gamma in itertools.product([-np.pi/2, -np.pi/3, 0, np.pi/3, np.pi/2], [-1., -0.5, 0., 0.5, 1.], [0.5, 1., 2., 4.]):
        s, t = scatter(triangle(angle), energy, gamma)
        grid.append({'phi': float(angle), 'energy': energy, 'gamma': gamma, 'circulation': circulation(t), 'mean_reflection': float(np.trace(t)/3), 'unitarity_error': error(s.conj().T@s, np.eye(3))})
    return {
        'schema': 'triangle_scattering_audit_v1',
        'conventions': {'hamiltonian_indices': 'H[target,source]', 'oriented_bonds': ['0->1','1->2','2->0'], 'bond_amplitude': 't exp(+i phi/3)', 'loop_product': 'H[1,0] H[2,1] H[0,2] = t^3 exp(i phi)', 'retarded_green': '(E I-H+i gamma I/2)^-1', 'scattering': 'S=I-i gamma G', 'transmission': 'T[output,input]=abs(S[output,input])^2', 'port_coupling': 'W=sqrt(gamma) I, three single normalized channels; no unobserved leakage', 'circulation': 'mean_j(T[(j+1)%3,j]-T[(j-1)%3,j])', 'time_convention': 'exp(-i E t), hbar=1', 'energy_unit': 't=1'},
        'recommended': {'t':1., 'phi_plus':float(phi), 'phi_minus':float(-phi), 'energy':0., 'gamma':2., 'eigenvalues_plus':clean(np.linalg.eigvalsh(hplus)), 'eigenvalues_minus':clean(np.linalg.eigvalsh(hminus)), 'T_plus':clean(tp), 'T_minus':clean(tm), 'circulation_plus':circulation(tp), 'circulation_minus':circulation(tm), 'fixed_label_frobenius_difference':fixed_label_distance, 'gauge_angles':theta.tolist()},
        'detuned_preset': {'onsite':detuning, 'phi_plus':float(phi), 'phi_minus':float(-phi), 'energy':0., 'gamma':2., 'eigenvalues':clean(np.linalg.eigvalsh(hdplus)), 'T_plus':clean(tdplus), 'T_minus':clean(tdminus), 'circulation_plus':circulation(tdplus), 'circulation_minus':circulation(tdminus), 'diagonal_matching_permutations':matching_permutations, 'loop_product_distance':float(detuned_loop_distance), 'gauge_permutation_equivalence':False, 'proof_scope':'Unique onsite values force the identity matching permutation; gauge-invariant loop products differ. Time reversal remains an equivalence only if explicitly included in the chosen quotient.'},
        'checks':checks,
        'negative_controls': {'wrong_self_energy_halfwidth': {'detected':True,'unitarity_error':bad_unitarity}, 'nonhermitian_reverse_bond': {'detected':rejected}, 'spectrum_only_routing_inference': {'detected':True,'reason':'Same eigenvalues, opposite fixed-port intensity routing.'}, 'unlabelled_novelty_claim': {'detected':True,'reason':'Reflection maps the +/-flux triangles and all their ports exactly.'}},
        'grid': {'count':len(grid), 'description':'100 fixed three-site candidates; phi x energy x gamma. No optimization, learned model, actual materials, or large-size extrapolation.', 'rows':grid},
        'limits': [
            'An ideal coherent single-particle/linear-wave tight-binding scattering model; no chemistry, mechanics, nonlinear hysteresis, finite-temperature bath, fabrication or empirical validation.',
            'Complex hopping with nonzero loop phase breaks time reversal in this spinless model. An implementation requires a justified effective flux mechanism; ordinary static reciprocal spring networks do not inherit this behavior merely from the graph.',
            'Opposite flux with fixed external port labels gives distinct routing. Without labelled ports the symmetric triangle pair is equivalent by reflection and must not count as two intrinsically distinct unlabelled designs. The distinct-onsite preset removes this reflection equivalence under gauge plus permutation, but remains time-reversal related.',
            'Gauge invariance of intensities assumes independent site/port phase changes and the specified diagonal equal-channel coupling. Coherent superposition inputs require transforming their channel phases consistently.',
            'Ideal circulation occurs at a tuned point; the finite grid is a toy robustness screen, not a universal bandwidth, tolerance or scalable material claim.',
            'Flux is defined modulo 2pi. The uniform bond-phase gauge may change under phi->phi+2pi; all measured probabilities remain gauge-equivalent.',
            'Eigenspectrum is the closed Hamiltonian spectrum. Directional routing additionally depends on eigenvectors, port attachment, energy and coupling widths.'
        ]
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=Path(__file__).with_name('audit.json'))
    args = parser.parse_args()
    result = make_audit()
    args.output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'checks_passed':len(result['checks']), 'negative_controls':len(result['negative_controls']), 'grid_count':result['grid']['count'], 'output':str(args.output), 'recommended':result['recommended']}, indent=2))
