"""Bounded new illustrations, not a reproduction of the inaccessible source notebook."""
import json,math
from pathlib import Path
import numpy as np
from scipy.linalg import expm
from scipy.integrate import solve_ivp
ROOT=Path(__file__).resolve().parents[1]

def run():
 checks=[]
 def check(name,ok):
  checks.append({'name':name,'passed':bool(ok)})
  if not ok:raise AssertionError(name)
 def H(phi):return np.array([[0,1,np.exp(-1j*phi)],[1,0,1],[np.exp(1j*phi),1,0]],complex)
 def scattering(h,e=0,gamma=2):return np.eye(3)-1j*gamma*np.linalg.inv(e*np.eye(3)-h+1j*gamma/2*np.eye(3))
 ps=[0,math.pi/2,-math.pi/2];mat=[H(p) for p in ps];ss=[scattering(h) for h in mat];ts=[abs(s)**2 for s in ss]
 check('fixed-port reference response',np.allclose([t[:,0] for t in ts],[[.2,.4,.4],[0,1,0],[0,0,1]],atol=1e-12))
 check('opposite flux identical spectra',np.allclose(np.linalg.eigvalsh(mat[1]),np.linalg.eigvalsh(mat[2])))
 check('scattering probability conservation',all(np.allclose(s.conj().T@s,np.eye(3)) for s in ss))
 d=np.diag(np.exp(1j*np.array([.3,-.8,1.4])));h2=d@mat[1]@d.conj().T
 gauge_error=float(np.max(abs(abs(scattering(h2))**2-ts[1])))
 check('local rephasing leaves local-port intensities invariant',gauge_error<1e-12)
 p=np.eye(3)[[0,2,1]];d2=np.diag([1,-1j,-1j]);perm_error=float(np.max(abs(d2@p@mat[1]@p.T@d2.conj().T-mat[2])))
 check('symmetric opposite flux equivalent if output swap allowed',perm_error<1e-12)
 # Omitted energies are genuinely new tests, not evidence of general equivalence.
 alias_a=np.diag([0.,1.]);alias_b=np.diag([0.,2.]);b=np.array([[1.],[0.]]);c=b.T
 response=lambda a,e:complex((c@np.linalg.inv((e+1j)*np.eye(2)-a)@b)[0,0])
 check('unobserved state can alias under restricted ports',all(abs(response(alias_a,e)-response(alias_b,e))<1e-12 for e in [-1,0,1]))
 check('restricted-port alias is not full spectral equivalence',not np.allclose(np.linalg.eigvalsh(alias_a),np.linalg.eigvalsh(alias_b)))
 times=np.linspace(0,8,1601);freq=np.linspace(-4,4,801);nonnormal=[]
 for k in [0.,8.]:
  a=np.array([[-1.,k],[0.,-2.]])
  gains=np.array([np.linalg.svd(expm(a*t),compute_uv=False)[0] for t in times])
  rg=np.array([np.linalg.svd(np.linalg.inv(1j*w*np.eye(2)-a),compute_uv=False)[0] for w in freq])
  nonnormal.append({'offDiagonal':k,'eigenvalues':np.linalg.eigvals(a).tolist(),'maxAmplitudeGainOnGrid':float(gains.max()),'timeAtGridMaximum':float(times[gains.argmax()]),'maxResolventGainOnGrid':float(rg.max())})
 check('same eigenvalues hide transient gain',nonnormal[1]['maxAmplitudeGainOnGrid']>2 and nonnormal[0]['maxAmplitudeGainOnGrid']==1)
 f0=lambda t,x:-x;f1=lambda t,x:-x+3*x**3-2*x**5
 end=[float(solve_ivp(f,[0,30],[.9],rtol=1e-10,atol=1e-12).y[0,-1]) for f in [f0,f1]]
 check('same local derivative distinct large-perturbation endpoint',abs(end[0])<1e-8 and abs(end[1]-1)<1e-8)
 # Two-bit interior at sites 0,1; four environmental bits at sites 2..5.
 # Closed six-site periodic ring. Environment sets initial conditions, then evolves.
 def bits(n,k):return [(n>>j)&1 for j in range(k)]
 rows=[]
 for rule in range(256):
  funcs=[];mi=[]
  for env in range(16):
   out=[]
   for inp in range(4):
    state=np.array(bits(inp,2)+bits(env,4))
    for _ in range(3):
     idx=4*np.roll(state,1)+2*state+np.roll(state,-1)
     state=(rule>>idx)&1
    out.append(int(state[0]+2*state[1]))
   funcs.append(tuple(out));prob=np.bincount(out,minlength=4)/4
   mi.append(float(-sum(p*math.log2(p) for p in prob if p)))
  unique=set(funcs)
  rows.append({'rule':rule,'distinctFunctions':len(unique),'distinctBijectiveFunctions':sum(len(set(f))==4 for f in unique),'distinctConstantFunctions':sum(len(set(f))==1 for f in unique),'meanInputOutputInformationBits':float(np.mean(mi)),'bestInputOutputInformationBits':max(mi),'functions':[list(f) for f in sorted(unique)]})
 check('all 256 ECA evaluated with finite protocol',len(rows)==256 and all(1<=x['distinctFunctions']<=16 for x in rows))
 check('identity rule204 preserves input',rows[204]['functions']==[[0,1,2,3]] and rows[204]['bestInputOutputInformationBits']==2)
 check('zero rule erases input',rows[0]['functions']==[[0,0,0,0]] and rows[0]['bestInputOutputInformationBits']==0)
 # Generic network entropy fails a negative control for representation diversity.
 n=6;ev=np.linalg.eigvalsh(n*np.eye(n)-np.ones((n,n)));pos=ev[ev>1e-10];weights=pos/pos.sum();eff=float(np.exp(-sum(weights*np.log(weights))))
 check('identical-agent complete graph entropy false-diversity control',abs(eff-5)<1e-12)
 return {'schemaVersion':'idea-qd-controls/1','scope':'New dimensionless illustrations; source notebook files unavailable. No new device, AI-search advantage or general theorem claimed.','triangle':{'energy':0,'gamma':2,'portLabelsFixed':True,'fluxes':ps,'inputPort0Responses':[t[:,0].tolist() for t in ts],'gaugeIntensityError':gauge_error,'allowedPortSwapEquivalenceError':perm_error},'restrictedInterfaceAlias':{'systems':'diag(0,1), diag(0,2)','B':[1,0],'C':[1,0],'testedEnergies':[-1,0,1],'result':'Equal tested transfer functions while unobserved eigenvalues differ; never infer full gauge equivalence from finite response equality.'},'nonnormal':{'timeGrid':[0,8,1601],'frequencyGrid':[-4,4,801],'rows':nonnormal,'limit':'Finite-grid maxima, full-state B=C=I; gain alone does not measure useful computation or noise tolerance.'},'nonlinear':{'equations':['dx/dt=-x','dx/dt=-x+3x^3-2x^5'],'localDerivativeAtZero':[-1,-1],'initialState':.9,'endTime':30,'endpoints':end,'limit':'A basin counterexample, not a demonstrated write/read memory device.'},'eca':{'protocol':{'ringSites':6,'interiorSites':[0,1],'environmentSites':[2,3,4,5],'environmentCount':16,'inputCount':4,'steps':3,'boundary':'periodic','environment':'initial condition only, then evolves','inputPrior':'uniform four inputs','ruleBitConvention':'output bit indexed by 4*left+2*center+right'},'rows':rows,'limit':'Finite deterministic protocol, no noise, cost or physical compilation. Information equals output entropy for deterministic maps with fixed environment; this is not Dambre capacity.'},'invalidDiversityProxy':{'agentRepresentations':'six identical','communicationGraph':'complete','positiveLaplacianEntropyEffectiveCount':eff,'trueDistinctRepresentations':1},'checks':checks}
if __name__=='__main__':
 out=ROOT/'dist/idea-qd/controls.json';out.parent.mkdir(parents=True,exist_ok=True);data=run();out.write_text(json.dumps(data,indent=2)+'\n');print(json.dumps({'checks':len(data['checks']),'allPassed':all(c['passed'] for c in data['checks']),'nonnormal':data['nonnormal']['rows'],'ecaMaxFunctions':max(x['distinctFunctions'] for x in data['eca']['rows'])}))
