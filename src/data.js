export const domains = [
  { id: 'ai', name: 'AI 与编程', short: 'AI & CODE', icon: 'spark', color: '#667de0' },
  { id: 'visual', name: '视觉与影像', short: 'ART & IMAGE', icon: 'aperture', color: '#d3927a' },
  { id: 'music', name: '音乐与声音', short: 'MUSIC & SOUND', icon: 'music', color: '#8f85bd' },
  { id: 'language', name: '语言与表达', short: 'WORDS & VOICE', icon: 'message', color: '#6b9c8f' },
  { id: 'life', name: '生活与手作', short: 'LIFE & CRAFT', icon: 'leaf', color: '#b49b68' }
];

export const articles = [
  { id: 'seedance', slug: 'seedance', domain: 'ai', title: 'Seedance 影像展示：镜头运动与画面连贯性', subtitle: '观察宣传片中的运镜、场景衔接与人物动作。原始视频待补充。', enTitle: 'Seedance: camera movement and visual continuity', enSummary: 'A place for the original video and observations on movement and continuity.', type: 'video', readTime: '4 分钟', author: 'Skilloop 编辑部', date: '2026-11-02', tag: '本期焦点', cover: 'assets/editorial/motion.svg', related: ['Python', 'Photoshop'],
    body: '<p class="lead">本篇预留 Seedance 宣传片及相关观察。原始视频、版本、发布来源与时间待素材提供后补充。</p><h2>观察内容</h2><p>主页面将展示完整视频。阅读时可以对照主体动作、镜头移动和场景切换，分别记录画面是否连贯。</p><h2>记录方式</h2><p>对具体片段标注时间点，区分画面中能直接看到的结果与编辑判断。当前不填写未经核实的模型参数、性能排名或更新结论。</p><blockquote>观察项：主体运动、镜头移动、画面连贯性与声音配合。</blockquote><h2>素材来源</h2><p>待提供原始作品与发布链接。确认来源后，将补充作者、发布时间和完整署名。</p>',
    enBody: '<p>This page is reserved for a Seedance demonstration supplied by the project owner.</p><h2>Scope</h2><p>Observe subject movement, camera motion, scene transitions and audio. Original publication details will be added with the source material.</p>' },
  { id: 'own-light', slug: 'own-light', domain: 'visual', title: '摄影作品观察：曝光、色彩与后期处理', subtitle: '对照照片的原始画面与后期版本，观察处理方式。', enTitle: 'Photography: exposure, colour and post-processing', enSummary: 'Looking at colour, light and the photographs we bring home.', type: 'article', readTime: '3 分钟', author: '视觉观察室', date: '2026-11-01', tag: '视觉笔记', cover: 'assets/editorial/light.svg', related: ['Photoshop', '摄影'],
    body: '<p class="lead">本篇用于对照摄影原图与后期处理结果。实际照片及作者信息待补充。</p><h2>观察内容</h2><p>记录曝光、白平衡和画面色彩的变化。对照图保留相同的裁切范围，便于区分后期调整带来的差异。</p><h2>作品信息</h2><p>素材提供后补充拍摄者、拍摄场景与处理说明。当前画面仅用于预览版式。</p>', enBody: '<p>A photograph can hold the feeling of an afternoon.</p><p>This space is reserved for a series supplied by the project owner. Look at the colour, enjoy the light, and find your own point of view.</p>' },
  { id: 'fingerstyle', slug: 'fingerstyle', domain: 'music', title: '吉他指弹：旋律、低音与节奏的配合', subtitle: '一段演奏的结构与收音观察。完整演奏素材待补充。', enTitle: 'Fingerstyle guitar: melody, bass and rhythm', enSummary: 'A space for a fingerstyle performance and the sounds between the notes.', type: 'audio', readTime: '2 分钟', author: '声音收集站', date: '2026-11-01', tag: '听见新声', cover: 'assets/editorial/sound.svg', related: ['吉他', '音频剪辑'],
    body: '<p class="lead">本篇预留一段吉他指弹演奏。曲名、演奏者、发布来源与录音信息待补充。</p><h2>听什么</h2><p>分别观察旋律、低音和节奏如何配合，记录演奏中的停顿、拍弦与泛音。必要时可标注对应片段，便于讨论。</p><h2>录音信息</h2><p>实际音频提供后，补充设备与收音方式。对录音效果的描述以原始素材为准。</p>', enBody: '<p>Melody, bass and rhythm can live together in one pair of hands.</p><p>A fingerstyle performance will appear here. Start by listening, and see what you want to explore next.</p>' },
  { id: 'words', slug: 'words', domain: 'language', title: '表达观察：如何组织一次简短的自我介绍', subtitle: '从对话片段观察信息顺序、语速与日常表达。', enTitle: 'Speaking: structuring a short self-introduction', enSummary: 'Finding a personal voice through everyday conversation.', type: 'article', readTime: '3 分钟', author: '表达之间', date: '2026-10-31', tag: '另一种视角', cover: 'assets/editorial/words.svg', related: ['英语口语', '中文表达'],
    body: '<p class="lead">本篇预留一段简短自我介绍或对话。原始片段、讲述者及场景待补充。</p><h2>信息顺序</h2><p>观察开场、个人背景与具体经历之间的衔接。对照语速、停顿与用词，不把口音差异直接判断为表达能力差异。</p><h2>讨论范围</h2><p>以实际片段中的语句为例，讨论哪些信息清楚、哪些地方还可以补充。</p>', enBody: '<p>A personal story is a good place to start a conversation.</p><p>You do not need perfect sentences to make a real connection.</p>' },
  { id: 'hands', slug: 'hands', domain: 'life', title: '手作记录：从材料到成品的制作过程', subtitle: '关注材料选择、操作步骤与成品细节。原始作品待补充。', enTitle: 'Craft: materials, process and the finished object', enSummary: 'Small creative moments with wood, flour and everyday materials.', type: 'article', readTime: '3 分钟', author: '日常造物', date: '2026-10-30', tag: '生活新作', cover: 'assets/editorial/craft.svg', related: ['烘焙', '木作'],
    body: '<p class="lead">本篇预留一组手作过程与成品记录。材料、制作者及原始图片待补充。</p><h2>制作过程</h2><p>按照实际顺序呈现材料准备、加工、连接与整理步骤。尺寸与工具信息由作品提供者确认。</p><h2>成品细节</h2><p>在相同光线下观察接合、边缘与表面处理。当前媒体为版式占位。</p>', enBody: '<p>There is something satisfying about making a thing for your own home.</p><p>Leave room for the process, the small mistakes, and what you discover along the way.</p>' }
];

export const members = [
  { id: 'axia', name: '阿夏', initial: '夏', domain: 'visual', color: '#e6b59f', bio: '喜欢胶片色，也喜欢把工具讲得简单一点。', offer: 'Photoshop', offerLevel: 'S2', offerTitle: '给自己的照片换一个干净背景', want: 'Python', wantLevel: 'P2', wantTitle: '学会用条件判断写个小脚本', duration: '30 分钟', slot: '周六 15:00', completed: 12, evidence: '蒙版与图层作品', balance: 8, tags: ['可直接互换', '线上', '入门'], work: '保留原图，用蒙版替换背景，导出一张自己的旅行照片。' },
  { id: 'lin', name: '小林', initial: '林', domain: 'ai', color: '#a3b7e1', bio: '平时用 Python 处理表格，PS 还在入门。', offer: 'Python', offerLevel: 'P2', offerTitle: '把第一次 if / else 讲明白', want: 'Photoshop', wantLevel: 'S2', wantTitle: '修好自己拍得有点乱的照片', duration: '30 分钟', slot: '周六 16:00', completed: 7, evidence: '分档计算器与脚本', balance: 5, tags: ['可直接互换', '线上', '入门'], work: '运行分档运费脚本，验证四组边界输入，并解释自己的判断规则。' },
  { id: 'momo', name: '沫沫', initial: '沫', domain: 'music', color: '#c1afd7', bio: '周末弹琴，工作日听人讲有趣的事。', offer: '吉他', offerLevel: '', offerTitle: '一起把喜欢的那段前奏弹顺', want: '音频剪辑', wantLevel: '', wantTitle: '让自己的翻弹录音干净一点', duration: '45 分钟', slot: '周日 14:00', completed: 5, evidence: '演奏片段待补充', balance: 6, tags: ['自主约定', '线上'], work: '录下一段自己能独立完成的前奏，并记录需要继续练习的两个地方。' },
  { id: 'theo', name: 'Theo', initial: 'T', domain: 'language', color: '#9ec7ba', bio: '英语交流没问题，想练更自然的中文。', offer: '英语口语', offerLevel: '', offerTitle: '用英语讲讲你的下一次旅行', want: '中文表达', wantLevel: '', wantTitle: '练习一段自然的中文自我介绍', duration: '30 分钟', slot: '周日 10:00', completed: 11, evidence: '过往交流反馈', balance: 7, tags: ['自主约定', '线上'], work: '围绕自己的旅行完成一次短对话，记下三个新表达。' },
  { id: 'qiao', name: '乔乔', initial: '乔', domain: 'life', color: '#d3bb91', bio: '周末做面包，最近想试试木作。', offer: '烘焙', offerLevel: '', offerTitle: '聊聊第一条吐司为什么会失败', want: '木作', wantLevel: '', wantTitle: '给自己的桌面做一个小托盘', duration: '45 分钟', slot: '周日 16:00', completed: 4, evidence: '个人烘焙作品', balance: 4, tags: ['自主约定', '线上'], work: '整理适合自己厨房的吐司步骤和一次尝试记录。' },
  { id: 'noah', name: 'Noah', initial: 'N', domain: 'visual', color: '#abc0cf', bio: '喜欢摄影，想学一点照片文件整理。', offer: '摄影', offerLevel: '', offerTitle: '一起看你的三张照片', want: 'Python', wantLevel: 'P1', wantTitle: '整理一下自己的旅行花费', duration: '30 分钟', slot: '周六 20:00', completed: 8, evidence: '摄影作品待补充', balance: 5, tags: ['自主约定', '线上'], work: '对自己的三张照片做一次构图调整，并解释取舍。' }
];

export const activities = [
  { id: 'photo-walk', domain: 'visual', title: '这一周，分享一张喜欢的照片', description: '不用专业设备，带一张自己的照片，聊聊它背后的瞬间。', host: '阿夏', date: '11 月 7 日 · 周六 15:00', cap: 5, participants: ['axia', 'lin'], cover: 'assets/editorial/light.svg', duration: '45 分钟' },
  { id: 'first-script', domain: 'ai', title: '我的第一个生活小脚本', description: '聊聊你想交给代码的那件小事。会一点，也可以分享一点。', host: '小林', date: '11 月 8 日 · 周日 14:00', cap: 5, participants: ['lin', 'noah', 'theo'], cover: 'assets/editorial/motion.svg', duration: '45 分钟' },
  { id: 'listen-together', domain: 'music', title: '把最近单曲循环的歌带来', description: '轮流分享一段声音。可以只听，也可以讲讲为什么喜欢。', host: '沫沫', date: '11 月 8 日 · 周日 20:00', cap: 6, participants: ['momo', 'qiao'], cover: 'assets/editorial/sound.svg', duration: '60 分钟' }
];

export const tracks = {
  Python: [
    ['P1', '跑通第一个脚本', '变量、输入输出与数字', 'AA 分账计算器', ['写一个姓名问候程序', '把摄氏温度转成华氏温度'], ['输入总额和人数，输出正确的人均金额', '能解释字符串如何变成数字', '交付 .py 文件和一份运行示例'], '1—2 小时', 'https://www.py4e.com/html3/02-variables'],
    ['P2', '写出自己的判断规则', 'if / elif / else 与边界', '分档运费计算器', ['把分数转成等级', '识别负数与非数字输入'], ['不足 99 收 12，99 至不足 199 收 6，199 及以上免运费', '98.99、99、198.99、199 四组结果正确', '能解释边界情况并提示非法输入'], '1—2 小时', 'https://www.py4e.com/lessons/logic'],
    ['P3', '处理一组生活数据', '循环、列表、字典', '个人收藏清单统计', ['求一组账目的最大值与平均值', '统计标签出现次数'], ['按约定清理重复项和空白', '统计条目数量与标签', '空清单也能正常处理'], '2—3 小时', 'https://www.py4e.com/lessons/lists'],
    ['P4', '让逻辑可以重复使用', '函数、参数与基础断言', '可复用的个人清单工具', ['把 P2 改写成函数', '给函数添加边界断言'], ['至少三个职责明确的函数', '五个样例场景得到正确结果', '能独立修改一条统计规则'], '2—3 小时', 'https://www.py4e.com/lessons/functions'],
    ['P5', '完成一个文件小工具', 'csv、文件读写与异常', 'CSV 个人账单汇总器', ['读取五行 CSV 数据', '把汇总结果写到文本文件'], ['样例数据得到约定结果', '缺文件或缺列有清楚提示', '提交脚本、样例数据和运行说明'], '3—4 小时', 'https://www.py4e.com/lessons/files']
  ],
  Photoshop: [
    ['S1', '认识画布与图层', '新建、裁切、变换与导出', '自己的三图拼贴', ['把一张图裁成 1:1 与 16:9', '创建并重新排列三个图层'], ['画布为 1080 × 1080', '图片不拉伸，图层命名清楚', '提交可编辑 PSD 与 PNG'], '1—2 小时', 'https://www.opengraphicarts.org/photoshop'],
    ['S2', '用蒙版换一个背景', '选区、图层蒙版与边缘', '自己的旅行照片换背景', ['选中一个简单主体', '用蒙版恢复一小块被隐藏的区域'], ['保留原图，用蒙版完成调整', '在深浅两种底色上检查边缘', '提交 PSD、PNG 和图层说明'], '1.5—2.5 小时', 'https://wiki.digital-foundations.net/index.php?title=Chapter_11_CC18'],
    ['S3', '找回照片里的光', '色阶、曲线与调整图层', '照片调色前后对比', ['修正一张偏暗的照片', '统一两张照片的主色调'], ['使用至少两个可关闭的调整图层', '保留原图和主要明暗细节', '能说明每一步的调整目的'], '1.5—2.5 小时', 'https://wiki.digital-foundations.net/index.php?title=Chapter_8_CC18'],
    ['S4', '给自己的图片排版', '文字层级、对齐与留白', '个人旅行图文卡', ['用三个字号建立信息层级', '按参考线对齐文字与图片'], ['标题、照片、日期和文字清楚', '保持统一的对齐规则', '手机上能读清关键信息，文字可编辑'], '2—3 小时', 'https://www.opengraphicarts.org/photoshop'],
    ['S5', '交付一个完整作品', '合成、调色与多尺寸导出', '同一旅行的方图与竖图', ['把方图改成竖版', '检查导出文件的清晰度'], ['交付 1080 × 1080 与 1080 × 1440', '视觉一致、图片不拉伸、图层分组清楚', '提交 PSD、两张 PNG 和制作说明'], '3—4 小时', 'https://wiki.digital-foundations.net/index.php?title=Chapter_12_CC18']
  ]
};
