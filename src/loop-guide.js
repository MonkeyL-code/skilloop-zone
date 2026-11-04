export const pathways = {
  ai: { goal:'做出第一段 AI 小故事', want:'AIGC 分镜与生成', material:'一个故事梗概，或一次生成结果', obstacle:'不会把故事拆成镜头', outcome:'一份三个镜头的分镜表', preparation:'分清故事、分镜和生成；先尝试描述一个简单画面。', resource:'Seedance 2.5 与创作入口', href:'#article/seedance', workshop:'aigc-start' },
  visual: { goal:'修好自己的一张照片', want:'Photoshop 蒙版 / S2', material:'一张原图和希望达到的效果', obstacle:'主体边缘不自然', outcome:'一个可继续修改的图层与蒙版', preparation:'认识画布和图层；准备自己的原图。', resource:'Photoshop 入门练习', href:'#tasks?track=Photoshop', workshop:'photo-start' },
  music: { goal:'录好一段自己的弹奏', want:'录音与降噪', material:'一段录音和设备信息', obstacle:'录音有底噪', outcome:'找到噪声来源，留下处理前后对比', preparation:'分别录一段环境声和一段琴声。', resource:'指弹作品与声音观察', href:'#article/fingerstyle', workshop:'music-start' },
  language: { goal:'完成一次旅行英语对话', want:'英语口语', material:'一个旅行场景和自己的表达草稿', obstacle:'能看懂，但开口会卡住', outcome:'独立完成一次点餐对话', preparation:'选一个具体场景，写下自己最想说的三句话。', resource:'语言与表达观察', href:'#article/words', workshop:'language-start' },
  life: { goal:'做出自己的第一件小手作', want:'木作入门', material:'材料照片、尺寸和草图', obstacle:'不确定尺寸与连接方式', outcome:'一份可动手的材料与尺寸清单', preparation:'列出现有材料与工具；涉及切割时先了解操作安全。', resource:'材料与手作灵感', href:'#article/hands', workshop:'craft-start' }
};

export const peerFeedback = {
  axia:[{from:'小林',task:'旅行照片蒙版',text:'先让我保留原图，再解释每一层的作用。最后能自己修另一张照片。',tags:['讲解清楚','自己动手']}],
  lin:[{from:'阿夏',task:'Python 条件判断',text:'用我的分账例子讲 if / else，带着检查了边界输入。',tags:['适合入门','目标明确']}],
  momo:[{from:'乔乔',task:'第一段吉他前奏',text:'把节奏放慢让我跟弹，最后录下了自己能完成的一段。',tags:['耐心','有练习成果']}],
  theo:[{from:'沫沫',task:'旅行点餐口语',text:'围绕我真的会遇到的场景练习，卡住时会换一种说法。',tags:['交流自然','反馈具体']}],
  qiao:[{from:'阿夏',task:'第一次吐司尝试',text:'一起看了我的配方和步骤，明确了下次只调整哪一个变量。',tags:['建议具体','尊重节奏']}],
  noah:[{from:'小林',task:'照片构图反馈',text:'用我的三张照片讲取舍，每张只留一个最值得改的地方。',tags:['重点清楚','作品反馈']}]
};
