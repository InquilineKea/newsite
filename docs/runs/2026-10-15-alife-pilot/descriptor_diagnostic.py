#!/usr/bin/env python3
"""Deterministic measurement control. Not an ASAL/Lenia/CLIP replication.
Run: python descriptor_diagnostic.py > descriptor-results.json
Requires Python3 and NumPy. No network, models, training or random sampling.
"""
import json
import numpy as np
SIZE=64
STEPS=64
PATTERNS={'block':[(0,0),(0,1),(1,0),(1,1)],'blinker':[(0,0),(0,1),(0,2)],'glider':[(0,1),(1,2),(2,0),(2,1),(2,2)]}
def seed(name,dy=0,dx=0):
    a=np.zeros((SIZE,SIZE),dtype=bool)
    for y,x in PATTERNS[name]:a[8+y+dy,8+x+dx]=True
    return a
def step(a):
    n=np.zeros(a.shape,dtype=np.uint8)
    for dy in [-1,0,1]:
        for dx in [-1,0,1]:
            if dy or dx:n+=np.roll(a,(dy,dx),(0,1))
    return (n==3)|(a&(n==2))
def normalized(a):
    coords=np.argwhere(a)
    return tuple(map(tuple,coords-coords.min(axis=0))) if len(coords) else ()
def origin(a):return np.argwhere(a).min(axis=0)
def trajectory(a):
    frames=[]
    for _ in range(STEPS):frames.append(a.copy());a=step(a)
    return frames
out={'kind':'toy-measurement-control','size':SIZE,'steps':STEPS,'numpy':np.__version__,'boundary':'toroidal; assert no cells touch boundary in any measured frame','randomness':'none; deterministic known patterns','patterns':{}}
for name,expected in [('block',(1,[0,0])),('blinker',(2,[0,0])),('glider',(4,[1,1]))]:
    frames=trajectory(seed(name))
    assert all(not (f[0,:].any() or f[-1,:].any() or f[:,0].any() or f[:,-1].any()) for f in frames)
    period=next(i for i in range(1,STEPS) if normalized(frames[i])==normalized(frames[0]))
    shift=(origin(frames[period])-origin(frames[0])).tolist()
    assert (period,shift)==expected,(name,period,shift)
    assert all(np.array_equal(frames[t+period],np.roll(frames[t],tuple(shift),(0,1))) for t in range(STEPS-period))
    out['patterns'][name]={'unique_raw_frames':len({f.tobytes() for f in frames}),'unique_translation_normalized_shapes':len({normalized(f) for f in frames}),'relative_recurrence_period':period,'displacement_per_period':shift,'all_period_shift_checks_passed':True}
translations=[seed('glider',dy,dx) for dy in [0,4,8,12] for dx in [0,4,8,12]]
out['translated_glider_archive']={'members':len(translations),'raw_patterns':len({a.tobytes() for a in translations}),'translation_normalized_patterns':len({normalized(a) for a in translations})}
assert out['patterns']['glider']['unique_raw_frames']==64
assert out['patterns']['glider']['unique_translation_normalized_shapes']==4
assert out['translated_glider_archive']['raw_patterns']==16
assert out['translated_glider_archive']['translation_normalized_patterns']==1
out['interpretation']='A moving recurrent object can yield many image-unique observations without new intrinsic shape organization. Translation and velocity remain functionally important for navigation and collisions. Neither descriptor is universally correct.'
out['limits']=['Not a test of CLIP, ASAL, AURORA or Lenia.','Known hand-selected patterns; no search algorithm comparison or inferential statistics.','No evidence of agent-team superiority, indefinite novelty, evolution or cognition.','Translation normalization is appropriate only when absolute location is irrelevant to the question.']
print(json.dumps(out,indent=2))
