export const domains = [
  { id: 'ai', name: 'AI 与编程', short: 'AI & CODE', icon: 'spark', color: '#667de0' },
  { id: 'visual', name: '视觉与影像', short: 'ART & IMAGE', icon: 'aperture', color: '#d3927a' },
  { id: 'music', name: '音乐与声音', short: 'MUSIC & SOUND', icon: 'music', color: '#8f85bd' },
  { id: 'language', name: '语言与表达', short: 'WORDS & VOICE', icon: 'message', color: '#6b9c8f' },
  { id: 'life', name: '生活与手作', short: 'LIFE & CRAFT', icon: 'leaf', color: '#b49b68' }
];

export const articles = [
  { id: 'seedance', slug: 'seedance', domain: 'ai', title: '当想象，开始有了镜头语言', subtitle: '从 Seedance 的影像表达，看 AI 创作的新可能。', enTitle: 'When imagination finds its own camera', enSummary: 'A closer look at movement, rhythm and the possibilities of AI filmmaking.', type: 'video', readTime: '4 分钟', author: 'Skilloop 编辑部', date: '2026-11-02', tag: '本期焦点', cover: 'assets/editorial/motion.svg', related: ['Python', 'Photoshop'],
    body: '<p class="lead">有时候，让我们停下来多看一眼的，不是一个新工具，而是一种新的表达。</p><p>谈论 AI 影像时，我们习惯先看细节是否逼真。但一段影像的吸引力，还来自镜头如何移动、画面怎样呼吸，以及不同瞬间之间的连接。</p><h2>从一张画面，到一个瞬间</h2><p>一束光掠过水面，人物微微转头，远处的风吹动了树叶。单独看时，它们只是细节；连在一起，才成为观众愿意走进去的世界。</p><blockquote>技术让更多人拿到了镜头。至于镜头朝向哪里，依然是创作者自己的选择。</blockquote><h2>值得继续关注的，是表达</h2><p>这里将展示你提供的 Seedance 宣传视频。我们想一起观察画面里的运动、色彩和节奏，也聊聊这些变化如何影响自己的创作。</p><p>看完后，你可能只想收藏这段灵感，也可能想试着处理一张自己的照片、整理一段素材。喜欢某个领域，不需要立刻成为专家。</p>',
    enBody: '<p>Sometimes a new way of seeing is what makes us stop and look.</p><h2>From an image to a moment</h2><p>Movement, light and rhythm turn individual frames into an experience. The featured video will be replaced with media supplied by the project owner.</p><blockquote>More people can hold the camera. Where to point it remains a personal choice.</blockquote><p>Save an idea, enjoy the work, or meet someone who can help you try something of your own.</p>' },
  { id: 'own-light', slug: 'own-light', domain: 'visual', title: '旅行结束后，留住自己的光', subtitle: '一组照片，一段关于色彩与记忆的日常观察。', enTitle: 'Keeping a little of your own light', enSummary: 'Looking at colour, light and the photographs we bring home.', type: 'article', readTime: '3 分钟', author: '视觉观察室', date: '2026-11-01', tag: '视觉笔记', cover: 'assets/editorial/light.svg', related: ['Photoshop', '摄影'],
    body: '<p class="lead">每次旅行，总有几张照片没有拍成记忆里的样子。</p><p>也许是海边的天空太亮，也许是傍晚的街道太暗。有趣的是，修图不只是修正失误，也是在重新选择自己想留下什么。</p><h2>保留情绪，也保留细节</h2><p>这里预留一组由你提供的摄影作品。我们可以对照不同的色彩与构图，讨论一张照片为什么会让人想起某个下午。</p><p>你不需要学完所有工具，才开始整理自己的影像。能独立完成一次裁切、一次蒙版，已经足够迈出第一步。</p>', enBody: '<p>A photograph can hold the feeling of an afternoon.</p><p>This space is reserved for a series supplied by the project owner. Look at the colour, enjoy the light, and find your own point of view.</p>' },
  { id: 'fingerstyle', slug: 'fingerstyle', domain: 'music', title: '六根弦，也能撑起一个世界', subtitle: '留一点时间，给一段不赶路的指弹。', enTitle: 'A whole world on six strings', enSummary: 'A space for a fingerstyle performance and the sounds between the notes.', type: 'audio', readTime: '2 分钟', author: '声音收集站', date: '2026-11-01', tag: '听见新声', cover: 'assets/editorial/sound.svg', related: ['吉他', '音频剪辑'],
    body: '<p class="lead">一段指弹里，旋律、低音和节奏可以同时发生。</p><p>这里预留一段你提供的吉他演奏。与其急着拆解技法，不妨先听听：哪一个停顿最让你喜欢，哪一段旋律让你想跟着哼唱。</p><h2>从喜欢的声音开始</h2><p>有的人想弹出自己的第一首歌，有的人想把翻弹录得更清楚。两种兴趣，也可以成为互相认识的理由。</p>', enBody: '<p>Melody, bass and rhythm can live together in one pair of hands.</p><p>A fingerstyle performance will appear here. Start by listening, and see what you want to explore next.</p>' },
  { id: 'words', slug: 'words', domain: 'language', title: '换一种语言，讲自己的故事', subtitle: '那些不那么完美，却让人记住的表达。', enTitle: 'Your story, in another language', enSummary: 'Finding a personal voice through everyday conversation.', type: 'article', readTime: '3 分钟', author: '表达之间', date: '2026-10-31', tag: '另一种视角', cover: 'assets/editorial/words.svg', related: ['英语口语', '中文表达'],
    body: '<p class="lead">表达的开始，往往是愿意把自己的故事说出来。</p><p>准备一次旅行、介绍一道家常菜，或者聊聊刚听过的歌。真正的交流不一定需要完美句子。</p><p>这里将收集你提供的演讲、对谈或写作片段。读完以后，也许你会想找到一个愿意认真听你说话的人。</p>', enBody: '<p>A personal story is a good place to start a conversation.</p><p>You do not need perfect sentences to make a real connection.</p>' },
  { id: 'hands', slug: 'hands', domain: 'life', title: '让双手，做一点慢下来的事', subtitle: '木头、面粉、泥土，与生活里的小创造。', enTitle: 'Make something with your own hands', enSummary: 'Small creative moments with wood, flour and everyday materials.', type: 'article', readTime: '3 分钟', author: '日常造物', date: '2026-10-30', tag: '生活新作', cover: 'assets/editorial/craft.svg', related: ['烘焙', '木作'],
    body: '<p class="lead">做一个能放在自己桌上的小物件，会带来很具体的满足。</p><p>它不一定完美，却记录着你第一次量尺寸、揉面团或修整边缘的过程。</p><p>这里预留手作与烹饪作品。你可以只来欣赏，也可以分享自己会的一点，让别人少走一次弯路。</p>', enBody: '<p>There is something satisfying about making a thing for your own home.</p><p>Leave room for the process, the small mistakes, and what you discover along the way.</p>' }
];

export const members = [
  { id: 'axia', name: '阿夏', initial: '夏', domain: 'visual', color: '#e6b59f', bio: '喜欢胶片色，也喜欢把工具讲得简单一点。', offer: 'Photoshop', offerLevel: 'S2', offerTitle: '给自己的照片换一个干净背景', want: 'Python', wantLevel: 'P2', wantTitle: '学会用条件判断写个小脚本', duration: '30 分钟', slot: '周六 15:00', completed: 12, evidence: '蒙版与图层作品', balance: 8, tags: ['可直接互换', '线上', '入门'], work: '保留原图，用蒙版替换背景，导出一张自己的旅行照片。' },
  { id: 'lin', name: '小林', initial: '林', domain: 'ai', color: '#a3b7e1', bio: '用一点点代码，省下生活里重复的十分钟。', offer: 'Python', offerLevel: 'P2', offerTitle: '把第一次 if / else 讲明白', want: 'Photoshop', wantLevel: 'S2', wantTitle: '修好自己拍得有点乱的照片', duration: '30 分钟', slot: '周六 16:00', completed: 7, evidence: '分档计算器与脚本', balance: 5, tags: ['可直接互换', '线上', '入门'], work: '运行分档运费脚本，验证四组边界输入，并解释自己的判断规则。' },
  { id: 'momo', name: '沫沫', initial: '沫', domain: 'music', color: '#c1afd7', bio: '周末弹琴，工作日听人讲有趣的事。', offer: '吉他', offerLevel: '', offerTitle: '一起把喜欢的那段前奏弹顺', want: '音频剪辑', wantLevel: '', wantTitle: '让自己的翻弹录音干净一点', duration: '45 分钟', slot: '周日 14:00', completed: 5, evidence: '演奏片段待补充', balance: 6, tags: ['自主约定', '线上'], work: '录下一段自己能独立完成的前奏，并记录需要继续练习的两个地方。' },
  { id: 'theo', name: 'Theo', initial: 'T', domain: 'language', color: '#9ec7ba', bio: '聊旅行、电影，还有那些很难直译的词。', offer: '英语口语', offerLevel: '', offerTitle: '用英语讲讲你的下一次旅行', want: '中文表达', wantLevel: '', wantTitle: '练习一段自然的中文自我介绍', duration: '30 分钟', slot: '周日 10:00', completed: 11, evidence: '过往交流反馈', balance: 7, tags: ['自主约定', '线上'], work: '围绕自己的旅行完成一次短对话，记下三个新表达。' },
  { id: 'qiao', name: '乔乔', initial: '乔', domain: 'life', color: '#d3bb91', bio: '面包是周末的闹钟，木头是新的好奇。', offer: '烘焙', offerLevel: '', offerTitle: '聊聊第一条吐司为什么会失败', want: '木作', wantLevel: '', wantTitle: '给自己的桌面做一个小托盘', duration: '45 分钟', slot: '周日 16:00', completed: 4, evidence: '个人烘焙作品', balance: 4, tags: ['自主约定', '线上'], work: '整理适合自己厨房的吐司步骤和一次尝试记录。' },
  { id: 'noah', name: 'Noah', initial: 'N', domain: 'visual', color: '#abc0cf', bio: '想把日常拍得像自己看到的那样。', offer: '摄影', offerLevel: '', offerTitle: '一起看你的三张照片', want: 'Python', wantLevel: 'P1', wantTitle: '整理一下自己的旅行花费', duration: '30 分钟', slot: '周六 20:00', completed: 8, evidence: '摄影作品待补充', balance: 5, tags: ['自主约定', '线上'], work: '对自己的三张照片做一次构图调整，并解释取舍。' }
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
