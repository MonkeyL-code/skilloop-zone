const skills = [
  ['Photoshop','PS','蒙版','抠图','修图','图层'],
  ['Python','脚本','编程','代码','条件判断'],
  ['AIGC','Seedance','AI 小故事','AI 分镜','AI 视频','提示词','分镜与生成'],
  ['摄影','构图','拍摄'],
  ['录音','降噪','音频','收音'],
  ['吉他','指弹','弹奏'],
  ['英语','口语','旅行英语'],
  ['中文','汉语'],
  ['木作','手作','材料与工具'],
  ['烘焙','吐司','面包']
];
const normalize = text => String(text||'').toLowerCase().replace(/\s+/g,'');
function overlaps(a,b) {
  const left=normalize(a),right=normalize(b);
  if(!left||!right)return false;
  return skills.some(group=>group.some(s=>left.includes(normalize(s)))&&group.some(s=>right.includes(normalize(s)))) || left.includes(right) || right.includes(left);
}
export function loopStatus(topic,orders=[]) {
  const linked=orders.filter(o=>(o.requestTopic===topic.id||o.sourceTopic===topic.id)&&!['cancelled','review'].includes(o.status));
  const order=linked.find(o=>['accepted','working','completed'].includes(o.status))||linked[0];
  return {order,state:order?.status==='completed'?'completed':order&&['accepted','working'].includes(order.status)||topic.partnerId?'paired':order?'pending':'open'};
}
export function recommendLoops(request,topics,users,orders=[],round=0,limit=2) {
  if(!request||['paired','completed'].includes(loopStatus(request,orders).state))return {items:[],total:0};
  const ranked=[];
  for(const topic of topics) {
    const user=users[topic.memberId];
    if(topic.memberId==='you'||topic.memberId===request.memberId||!user||user.acceptingHelp===false||['paired','completed'].includes(loopStatus(topic,orders).state)||!overlaps(request.want,topic.offer))continue;
    const mutual=overlaps(request.offer,topic.want),sameTime=normalize(request.time)===normalize(topic.time)&&!!request.time;
    ranked.push({topic,mutual,sameTime,score:10+(mutual?10:0)+(sameTime?2:0),reason:mutual?`TA 能教${topic.offer}，也想学你的${request.offer}`:`TA 能教${topic.offer}，可以聊聊积分互助`});
  }
  ranked.sort((a,b)=>b.score-a.score);
  const seen=new Set(),unique=ranked.filter(({topic})=>{if(seen.has(topic.memberId))return false;seen.add(topic.memberId);return true;});
  const start=(Math.max(0,round)*limit)%Math.max(1,unique.length);
  return {total:unique.length,items:unique.slice(start,start+limit)};
}
