// Restore handlers referenced by the bundled curriculum.
function value(id) { return Number(document.getElementById(id).value); }
function put(id, text) { document.getElementById(id).textContent = text; }
function simCalc() {
 const l=value('cLayers'), h=value('cHidden'), s=value('cSeq'), p=12*l*h*h/1e9;
 put('cLayersV',l); put('cHiddenV',h); put('cSeqV',s);
 put('cParams',p.toFixed(2)+'B'); put('cMem',(p*2).toFixed(2)+' GB');
 put('cFlops',(p*6).toFixed(1)+' GF'); put('cAttn',s>=16384?'高':s>=4096?'中':'低');
}
function simParallel() {
 const n=value('pGpu'), t=value('pTp'), p=value('pPp'), e=value('pEp'), group=t*p*e, ok=n%group===0;
 put('pGpuV',n); put('pTpV',t); put('pPpV',p); put('pEpV',e);
 put('pDp',ok?n/group:'—'); put('pProd',ok?n:group); put('pRisk',t*e>16?'高':'中');
 put('pState',ok?'合法':'不可整除'); document.getElementById('pState').className=ok?'good':'bad';
 put('pHint',ok?`${n} = ${n/group} DP × ${p} PP × ${t} TP × ${e} EP（教学简化分组）。`:'GPU 总数必须能被 TP × PP × EP 整除，请调整分组。');
}
function simEngine() {
 const b=value('eBatch'), m=value('eMem'), t=value('eTp');
 put('eBatchV',b); put('eMemV',m+'%'); put('eTpV',t);
 put('eTtft',Math.round(100+b/128+t*8)+' ms'); put('eTps',(Math.sqrt(b/2048)*t*.85).toFixed(1)+'K');
 put('eKv',(100-m)+'%'); put('eRisk',m>94?'高':b>16384?'中':'低');
 put('eHint','教学估算：增大 batch 可提高吞吐，但会增加排队；显存利用率过高会减少突发负载余量。');
}
function simCluster() {
 const n=[64,256,1024][value('fleetR')], t=value('ctpR'), p=value('cppR'), ok=n%(t*p)===0;
 const m=Math.max(20,50-t*.7-p*.6);
 put('fleetV',n); put('ctpV',t); put('cppV',p); put('cdp',ok?n/(t*p):'—');
 put('cmfu',ok?Math.round(m)+'%':'—'); put('crisk',!ok?'无效':t>8?'高':'中');
 put('ctps',ok?(n*m/100*10000/1e6).toFixed(2)+'M':'—');
 put('clusterHint',ok?`${n} = ${n/(t*p)} DP × ${p} PP × ${t} TP。吞吐为教学估算。`:'无效组合：GPU 总数无法被 TP × PP 整除。');
}
function configPick(i,el) {
 document.querySelectorAll('#config .choice').forEach(x=>x.classList.remove('selected')); el.classList.add('selected');
 put('configFeedback',i===1?'✓ 小 micro-batch 配合梯度累积与 activation checkpointing，先控制显存，再测吞吐和收敛。':'显存压力过大，请降低 micro-batch 并考虑 checkpointing。');
 if(i===1) reward(100);
}
const coreSeen=new Set();
const coreLessons=[
 ['Token / Embedding','将离散 token 映射为可学习的向量。','X = E[token_ids]'],
 ['Q / K / V','三个投影分别形成查询、键和值。','Q=XWq, K=XWk, V=XWv'],
 ['Causal Attention','通过因果掩码阻止读取未来 token。','softmax(QKᵀ / √d + mask)V'],
 ['RoPE','对 Q/K 施加位置相关旋转，使点积编码相对位置。','q′=R(position)q'],
 ['RMSNorm','按均方根归一化隐藏向量，再施加可学习缩放。','x / √(mean(x²)+ε) × γ'],
 ['SwiGLU','门控前馈网络对每个 token 进行非线性变换。','(SiLU(xWg) ⊙ xWu)Wd'],
 ['Residual','残差路径保留输入并帮助梯度传播。','y=x+block(x)'],
 ['LM Head / Loss','将隐藏状态投影到词表，预测下一个 token。','loss = −log p(next_token)']
];
function renderCore() {
 document.getElementById('coreSteps').innerHTML=coreLessons.map((x,i)=>`<button class="mission" onclick="coreOpen(${i},this)">${i+1}. ${x[0]}</button>`).join('');
 simCore();
}
const learningPaths={
 transformer:['Transformer',['transformercore','runtime'],'依次探索核心组件、张量形状与前后向传播。'],
 pretrain:['Pre-training',['memorylab','config','dashboard'],'练习显存预算、训练配置与稳定性观察。'],
 dpopath:['DPO Mastery',['dpo'],'比较偏好选项，理解 reference policy 与 β 的作用。'],
 grpopath:['GRPO / RLVR',['grpo','rlvr','rlsim'],'从奖励与验证器入手，再观察策略漂移。'],
 archpath:['MTP / MoE',['mtplab','moe'],'联合评估辅助目标、稀疏路由和系统成本。'],
 inferpath:['Inference Mastery',['kv','batching','quant','engine'],'探索 KV cache、调度、量化与延迟吞吐权衡。']
};
let currentPath=null;
function openPath(key) {
 const path=learningPaths[key]; if(!path)return; currentPath=key; show('path');
 const box=document.getElementById('pathContent'); box.replaceChildren();
 const heading=document.createElement('h1');heading.textContent=path[0];box.append(heading);
 const intro=document.createElement('p');intro.textContent=path[2];box.append(intro);
 path[1].forEach(id=>{const button=document.createElement('button');button.className='choice';button.textContent=lessons[id]?.title||document.querySelector('#'+id+' h1')?.textContent||id;button.onclick=()=>{if(lessons[id])openLesson(id);else {show(id);if(id==='transformercore')renderCore();}};box.append(button);});
}
function backToPath(){if(currentPath)openPath(currentPath);else show('home');}
function completePath(){if(currentPath){activeLessonKey='path:'+currentPath;reward(120);}}
