export const domains = [
  { id: 'ai', name: 'AI 与编程', short: 'AI & CODE', icon: 'spark', color: '#667de0' },
  { id: 'visual', name: '视觉与影像', short: 'ART & IMAGE', icon: 'aperture', color: '#d3927a' },
  { id: 'music', name: '音乐与声音', short: 'MUSIC & SOUND', icon: 'music', color: '#8f85bd' },
  { id: 'language', name: '语言与表达', short: 'WORDS & VOICE', icon: 'message', color: '#6b9c8f' },
  { id: 'life', name: '生活与手作', short: 'LIFE & CRAFT', icon: 'leaf', color: '#b49b68' }
];

export const articles = [
  {
    "id": "seedance",
    "slug": "seedance",
    "domain": "ai",
    "title": "Seedance 2.5：30 秒，让故事更完整",
    "subtitle": "更长叙事、精准参考与视频编辑，新一代模型的创作变化。",
    "enTitle": "Seedance 2.5: more room for a story",
    "enSummary": "Longer stories, finer references and more control over video editing.",
    "type": "article",
    "readTime": "2 分钟",
    "author": "字节跳动 Seed",
    "date": "2026-11-03",
    "tag": "本期焦点",
    "cover": "assets/editorial/seedance-2-5-portrait.webp",
    "related": [
      "Python",
      "Photoshop"
    ],
    "sourceUrl": "https://seed.bytedance.com/zh/seedance2_5",
    "body": "<p class=\"lead\">一个镜头之外，故事还能走多远？Seedance 2.5 把单段视频生成时长提升到 30 秒，让创作拥有更完整的起承转合。</p><h2>从一个片段，到一段叙事</h2><p>根据官方介绍，模型支持两次视频延长，并进一步改善运动稳定性和画面真实感。对于需要连续动作、情绪变化和场景衔接的作品，更长的时长也意味着创作者有空间安排节奏，而不只是展示一个瞬间。</p><h2>参考不只复刻动作</h2><p>这次更新也强调对参考视频意图和镜头语言的理解，以及更精细的音视频编辑。白模控制、绿幕编辑等能力，则为专业流程增加了新的入口。封面来自官网竖版生成案例：人物手持摄影机，暖色光源与暗部层次共同构成电影感的画面。</p><p class=\"article-source\">转载摘编：<a href=\"https://seed.bytedance.com/zh/seedance2_5\">字节跳动 Seed 中文官网 · 阅读原文 ↗</a><br>图片：Seedance 2.5 官方生成案例画面，字节跳动 Seed</p>",
    "enBody": "<p>Seedance 2.5 extends single video generations to 30 seconds and supports two extensions. Its official presentation highlights more stable motion, finer reference control, video editing, white-model control and green-screen editing.</p><p>The cover is a still from an official generated example.</p><p class=\"article-source\">转载摘编：<a href=\"https://seed.bytedance.com/zh/seedance2_5\">ByteDance Seed · 阅读原文 ↗</a><br>图片：ByteDance Seed, official Seedance 2.5 generated example</p>"
  },
  {
    "id": "own-light",
    "slug": "own-light",
    "domain": "visual",
    "title": "2026 索尼摄影大赛：风光里的另一种观看",
    "subtitle": "从纳米比亚沙丘到红外森林，欣赏风光类获奖与入围作品。",
    "enTitle": "Landscapes through a different lens",
    "enSummary": "Selected landscape photographs from the 2026 Sony World Photography Awards.",
    "type": "article",
    "readTime": "2 分钟",
    "author": "中国摄影网 · 澎湃号",
    "date": "2026-03-03",
    "tag": "视觉与影像",
    "cover": "assets/editorial/landscape.webp",
    "related": [
      "摄影",
      "Photoshop"
    ],
    "sourceUrl": "https://www.thepaper.cn/newsDetail_forward_32680936",
    "body": "<p class=\"lead\">同样是山川、湖泊与树林，摄影师却能让熟悉的自然呈现出不同的性格。2026 年索尼世界摄影大赛公开组风光类作品，提供了一组丰富的观看入口。</p><h2>光线把沙丘变成画布</h2><p>美国摄影师 J Fritz Rumpf 的冠军作品《沙漠的形态与纹理》，记录了纳米比亚索苏斯维利沙丘的清晨。蜜桃色沙面、深色阴影与一小片绿色彼此交错，地貌的纹理因此有了近乎绘画的秩序。</p><h2>风景，也可以超出肉眼</h2><p>入围作品里，Matteo Redaelli 用红外摄影让特内里费岛的松林变为白色；另一些创作者把镜头转向冰层下的气泡、雾中的树与湖面倒影。它们并不急于交代一个地点，而是先让人感受到温度、时间与空间。</p><p class=\"article-source\">转载摘编：<a href=\"https://www.thepaper.cn/newsDetail_forward_32680936\">中国摄影网／澎湃号·湃客 · 阅读原文 ↗</a><br>图片：《沙漠的形态与纹理》© J Fritz Rumpf，原文配图</p>",
    "enBody": "<p>J Fritz Rumpf won the landscape category of the 2026 Sony World Photography Awards Open competition with Shapes and Patterns of the Desert. The photograph combines pastel dunes, dark shadows and green vegetation in Namibia.</p><p class=\"article-source\">转载摘编：<a href=\"https://www.thepaper.cn/newsDetail_forward_32680936\">The Paper / China Photography · 阅读原文 ↗</a><br>图片：© J Fritz Rumpf</p>"
  },
  {
    "id": "fingerstyle",
    "slug": "fingerstyle",
    "domain": "music",
    "title": "许绮娟《小天使》：把生活写进六根弦",
    "subtitle": "十年创作、四年制作，一张结合指弹吉他与手绘的原创专辑。",
    "enTitle": "Little Angel: life stories on six strings",
    "enSummary": "A new fingerstyle guitar album by Chijuan Hsu, paired with original illustrations.",
    "type": "article",
    "readTime": "2 分钟",
    "author": "风潮音乐 Wind Music",
    "date": "2026-10-28",
    "tag": "音乐与声音",
    "cover": "assets/editorial/guitar.webp",
    "related": [
      "吉他",
      "音频剪辑"
    ],
    "sourceUrl": "https://vocus.cc/article/6ae1660afd89780001bbc7e0",
    "body": "<p class=\"lead\">音乐不一定从宏大的主题开始，也可能来自一次告别、一个陪伴多年的玩偶，或生活里一句被记住的话。</p><h2>九首作品，慢慢长成一张专辑</h2><p>指弹吉他音乐家许绮娟在 2026 年 10 月 28 日推出《小天使 Little Angel》。这张专辑经历十年创作与四年制作，收录九首原创音乐，由她完成作曲、编曲、演奏、混音及母带制作，并演绎二十种乐器。</p><h2>声音之外，还有可以翻阅的画面</h2><p>专辑以指弹吉他为核心，加入世界乐器与自然声景；部分旋律也从她参与电影配乐时的创作延伸而来。她另外绘制了二十张原创牌卡，让听众在声音之外，透过图画和文字走近这些作品。封面的原型，则是陪伴她三十多年的玩偶“小白”。</p><p class=\"article-source\">转载摘编：<a href=\"https://vocus.cc/article/6ae1660afd89780001bbc7e0\">风潮音乐 Wind Music／方格子 · 阅读原文 ↗</a><br>图片：风潮音乐提供</p>",
    "enBody": "<p>Fingerstyle guitarist Chijuan Hsu released Little Angel on October 28, 2026. The album features nine original compositions, twenty instruments and twenty illustrated cards, bringing together music and personal memories.</p><p class=\"article-source\">转载摘编：<a href=\"https://vocus.cc/article/6ae1660afd89780001bbc7e0\">Wind Music / vocus · 阅读原文 ↗</a><br>图片：Wind Music</p>"
  },
  {
    "id": "words",
    "slug": "words",
    "domain": "language",
    "title": "Skibidi、Delulu：网络热词走进剑桥词典",
    "subtitle": "从玩笑到日常表达，互联网正在留下自己的语言痕迹。",
    "enTitle": "Internet slang enters the dictionary",
    "enSummary": "Skibidi and delulu are among thousands of additions to the Cambridge Dictionary.",
    "type": "article",
    "readTime": "2 分钟",
    "author": "扬子晚报 · 紫牛新闻",
    "date": "2025-08-19",
    "tag": "语言与表达",
    "cover": "assets/editorial/words-real.webp",
    "related": [
      "英语口语",
      "中文表达"
    ],
    "sourceUrl": "https://www.yzwb.net/news/txs/202508/t20250819_252151.html",
    "body": "<p class=\"lead\">一个词要被使用多少次，才会从弹幕、评论区和朋友间的玩笑，走进一本正式词典？</p><h2>六千多个新词里的网络生活</h2><p>据紫牛新闻报道，剑桥词典在 2025 年新增 6212 个词汇、短语及释义。“Skibidi”可以表示酷、糟糕，也可以只是没有明确意思的玩笑；“delulu”来自 delusional，用来描述选择相信不真实事物的状态。</p><h2>变化的不只是流行梗</h2><p>新词里也有反映工作方式的表达：mouse jiggler 指让电脑看起来仍在使用的设备或软件，work spouse 则描述职场中彼此信任、互相支持的伙伴。词典编撰者关注的并非一时热度，而是这些表达能否持续出现在真实交流中。语言的变化，也就成了观察生活变化的一个窗口。</p><p class=\"article-source\">转载摘编：<a href=\"https://www.yzwb.net/news/txs/202508/t20250819_252151.html\">扬子晚报·紫牛新闻 · 阅读原文 ↗</a><br>图片：紫牛新闻原文配图</p>",
    "enBody": "<p>Cambridge Dictionary added 6,212 words, phrases and meanings in 2025, including skibidi and delulu. Other additions such as mouse jiggler and work spouse reflect changing work habits and relationships.</p><p class=\"article-source\">转载摘编：<a href=\"https://www.yzwb.net/news/txs/202508/t20250819_252151.html\">Yangtze Evening News / Ziniu News · 阅读原文 ↗</a><br>图片：Original article image</p>"
  },
  {
    "id": "hands",
    "slug": "hands",
    "domain": "life",
    "title": "罗意威工艺奖：纸与陶瓷之间的新可能",
    "subtitle": "Jongjin Park 的《幻影地层》，让柔软与坚固相遇。",
    "enTitle": "Between paper and porcelain",
    "enSummary": "Jongjin Park wins the 2026 LOEWE FOUNDATION Craft Prize with Strata of Illusion.",
    "type": "article",
    "readTime": "2 分钟",
    "author": "LOEWE FOUNDATION",
    "date": "2026-05-12",
    "tag": "生活与手作",
    "cover": "assets/editorial/craft-real.webp",
    "related": [
      "陶艺",
      "手作"
    ],
    "sourceUrl": "https://craftprize.loewe.com/zh/craftprize2026",
    "body": "<p class=\"lead\">纸张是轻薄的，陶瓷是坚固的。把两种材料放在一起，会得到一个怎样的物件？</p><h2>一件向内倾斜的作品</h2><p>2026 年罗意威基金会工艺奖在新加坡举行。韩国艺术家 Jongjin Park 凭借《Strata of Illusion》（《幻影地层》，2025）获得大奖。作品将纸与陶瓷泥浆结合，层叠的结构在烧制后呈现出近似地层的纹理，边缘又保留着向内倾斜的动态。</p><h2>材料的边界，也可以重新想象</h2><p>本届特别奖同时授予 Baba Tree Master Weavers 与 Álvaro Catalán de Ocón 合作的《Frafra Tapestry》，以及 Graziano Visintin 的《Collier》。编织、陶瓷和金属在这里既是传统技艺的延续，也是新的表达方式：日常材料经过人的双手，显露出另一种可能。</p><p class=\"article-source\">转载摘编：<a href=\"https://craftprize.loewe.com/zh/craftprize2026\">LOEWE 罗意威基金会中文官网 · 阅读原文 ↗</a><br>图片：LOEWE FOUNDATION，艺术家与获奖作品；制作过程参考<a href=\"https://www.zaobao.com.sg/lifestyle/design-decor/story20260524-9060503\">联合早报报道</a></p>",
    "enBody": "<p>Jongjin Park won the 2026 LOEWE FOUNDATION Craft Prize for Strata of Illusion, a work combining paper and porcelain slip. Special mentions went to Frafra Tapestry and Collier.</p><p class=\"article-source\">转载摘编：<a href=\"https://craftprize.loewe.com/zh/craftprize2026\">LOEWE FOUNDATION · 阅读原文 ↗</a><br>图片：LOEWE FOUNDATION</p>"
  }
];

export const members = [
  { id:'ning',name:'阿宁',initial:'宁',domain:'visual',color:'#bccde5',bio:'给旅行照片留一点真实的颜色。',offer:'Photoshop',offerLevel:'S2',offerTitle:'一起修好照片里不自然的边缘',want:'Python',wantLevel:'P2',wantTitle:'用 Python 算清一次旅行的分账',duration:'30 分钟',slot:'周六 15:00',completed:4,evidence:'旅行照片蒙版练习',balance:4,work:'保留原图，自己做出能继续修改的蒙版。' },
  { id:'keke',name:'可可',initial:'可',domain:'visual',color:'#e2b9a0',bio:'用 PS 做自己的旅行小卡片。',offer:'Photoshop',offerLevel:'S2',offerTitle:'从图层顺序到简单换背景',want:'Python',wantLevel:'P1',wantTitle:'学会批量整理照片文件名',duration:'30 分钟',slot:'周日 14:00',completed:3,evidence:'个人照片排版练习',balance:3,work:'独立完成一张保留图层的换背景练习。' },
  { id:'yue',name:'小越',initial:'越',domain:'visual',color:'#c8c3df',bio:'周末修图，也想把重复操作交给代码。',offer:'Photoshop',offerLevel:'S2',offerTitle:'把一张照片的边缘修自然',want:'Python',wantLevel:'P2',wantTitle:'按月份整理自己的照片',duration:'30 分钟',slot:'周六 20:00',completed:5,evidence:'照片处理前后对照',balance:4,work:'检查深浅底色上的蒙版边缘，留下可编辑图层。' },
  { id:'zhou',name:'小周',initial:'周',domain:'music',color:'#b3cbbf',bio:'在家录声音，也弹一点吉他。',offer:'录音与降噪',offerLevel:'',offerTitle:'一起找出录音里杂音的来源',want:'Python',wantLevel:'P1',wantTitle:'整理录音文件的小脚本',duration:'30 分钟',slot:'周日 14:00',completed:4,evidence:'居家录音对照',balance:4,work:'用同一段录音留下调整前后的对照。' },
  { id:'an',name:'小安',initial:'安',domain:'ai',color:'#a8bedb',bio:'用 AI 拍小故事，喜欢先画三格分镜。',offer:'AIGC 分镜与生成',offerLevel:'',offerTitle:'把一个小故事拆成三个镜头',want:'Python',wantLevel:'P1',wantTitle:'用脚本整理角色素材',duration:'30 分钟',slot:'周六 16:00',completed:3,evidence:'三个镜头的分镜练习',balance:4,work:'一份能自己继续修改的三镜头分镜表。' },
  { id:'mu',name:'阿木',initial:'木',domain:'life',color:'#cfb994',bio:'从草图和尺寸开始做小木作。',offer:'木作入门',offerLevel:'',offerTitle:'一起看材料、尺寸和连接方式',want:'家庭烘焙',wantLevel:'',wantTitle:'周末做出第一条吐司',duration:'30 分钟',slot:'周日 16:00',completed:3,evidence:'木托盘草图',balance:4,work:'整理一张标好尺寸的草图和材料清单。' },
  { id: 'axia', name: '阿夏', initial: '夏', domain: 'visual', color: '#e6b59f', bio: '喜欢胶片色，也喜欢把工具讲得简单一点。', offer: 'Photoshop', offerLevel: 'S2', offerTitle: '给自己的照片换一个干净背景', want: 'Python', wantLevel: 'P2', wantTitle: '学会用条件判断写个小脚本', duration: '30 分钟', slot: '周六 15:00', completed: 12, evidence: '蒙版与图层作品', balance: 8, tags: ['可直接互换', '线上', '入门'], work: '保留原图，用蒙版替换背景，导出一张自己的旅行照片。' },
  { id: 'lin', name: '小林', initial: '林', domain: 'ai', color: '#a3b7e1', bio: '平时用 Python 处理表格，PS 还在入门。', offer: 'Python', offerLevel: 'P2', offerTitle: '把第一次 if / else 讲明白', want: 'Photoshop', wantLevel: 'S2', wantTitle: '修好自己拍得有点乱的照片', duration: '30 分钟', slot: '周六 16:00', completed: 7, evidence: '分档计算器与脚本', balance: 5, tags: ['可直接互换', '线上', '入门'], work: '运行分档运费脚本，验证四组边界输入，并解释自己的判断规则。' },
  { id: 'momo', name: '沫沫', initial: '沫', domain: 'music', color: '#c1afd7', bio: '周末弹琴，工作日听人讲有趣的事。', offer: '吉他', offerLevel: '', offerTitle: '一起把喜欢的那段前奏弹顺', want: '音频剪辑', wantLevel: '', wantTitle: '让自己的翻弹录音干净一点', duration: '45 分钟', slot: '周日 14:00', completed: 5, evidence: '暂无演奏作品', balance: 6, tags: ['自主约定', '线上'], work: '录下一段自己能独立完成的前奏，并记录需要继续练习的两个地方。' },
  { id: 'theo', name: 'Theo', initial: 'T', domain: 'language', color: '#9ec7ba', bio: '英语交流没问题，想练更自然的中文。', offer: '英语口语', offerLevel: '', offerTitle: '用英语讲讲你的下一次旅行', want: '中文表达', wantLevel: '', wantTitle: '练习一段自然的中文自我介绍', duration: '30 分钟', slot: '周日 10:00', completed: 11, evidence: '过往交流反馈', balance: 7, tags: ['自主约定', '线上'], work: '围绕自己的旅行完成一次短对话，记下三个新表达。' },
  { id: 'qiao', name: '乔乔', initial: '乔', domain: 'life', color: '#d3bb91', bio: '周末做面包，最近想试试木作。', offer: '烘焙', offerLevel: '', offerTitle: '聊聊第一条吐司为什么会失败', want: '木作', wantLevel: '', wantTitle: '给自己的桌面做一个小托盘', duration: '45 分钟', slot: '周日 16:00', completed: 4, evidence: '个人烘焙作品', balance: 4, tags: ['自主约定', '线上'], work: '整理适合自己厨房的吐司步骤和一次尝试记录。' },
  { id: 'noah', name: 'Noah', initial: 'N', domain: 'visual', color: '#abc0cf', bio: '喜欢摄影，想学一点照片文件整理。', offer: '摄影', offerLevel: '', offerTitle: '一起看你的三张照片', want: 'Python', wantLevel: 'P1', wantTitle: '整理一下自己的旅行花费', duration: '30 分钟', slot: '周六 20:00', completed: 8, evidence: '暂无摄影作品', balance: 5, tags: ['自主约定', '线上'], work: '对自己的三张照片做一次构图调整，并解释取舍。' }
];

export const activities = [
  { id: 'photo-walk', domain: 'visual', title: '这一周，分享一张喜欢的照片', description: '不用专业设备，带一张自己的照片，聊聊它背后的瞬间。', host: '阿夏', date: '11 月 7 日 · 周六 15:00', cap: 5, participants: ['axia', 'lin'], cover: 'assets/activities/photo-walk.webp', duration: '45 分钟' },
  { id: 'first-script', domain: 'ai', title: '我的第一个生活小脚本', description: '聊聊你想交给代码的那件小事。会一点，也可以分享一点。', host: '小林', date: '11 月 8 日 · 周日 14:00', cap: 5, participants: ['lin', 'noah', 'theo'], cover: 'assets/activities/first-script.webp', duration: '45 分钟' },
  { id: 'listen-together', domain: 'music', title: '把最近单曲循环的歌带来', description: '轮流分享一段声音。可以只听，也可以讲讲为什么喜欢。', host: '沫沫', date: '11 月 8 日 · 周日 20:00', cap: 6, participants: ['momo', 'qiao'], cover: 'assets/activities/listen-together.webp', duration: '60 分钟' },
  {"id": "aigc-start", "domain": "ai", "title": "第一次 AIGC：一起拆出三个镜头", "description": "免费入门共学。看懂故事、分镜、参考图与生成的关系，用共同案例完成第一次练习。", "host": "小林", "date": "11 月 7 日 · 周六 10:00", "cap": 8, "participants": ["lin", "noah"], "cover": "assets/activities/aigc-start.webp", "duration": "45 分钟", "kind": "workshop", "preparation": "能打开创作工具即可；可以只观察，不要求先学 Python。", "outcome": "一份三个镜头的练习分镜表。", "agenda": "认识制作流程 → 跟做一个简单案例 → 自己替换一个想法 → 记下具体卡点。"},
  {"id": "photo-start", "domain": "visual", "title": "PS 入门共学：图层与第一张蒙版", "description": "准备一张自己的照片，认识图层、选区和蒙版；复杂边缘问题留给后续互助。", "host": "阿夏", "date": "11 月 7 日 · 周六 11:00", "cap": 8, "participants": ["axia"], "cover": "assets/activities/photo-start.webp", "duration": "45 分钟", "kind": "workshop", "preparation": "准备可用的 Photoshop 和一张自己的照片。", "outcome": "一份保留原图的蒙版练习。", "agenda": "认识图层 → 跟做简单选区 → 用蒙版隐藏与恢复 → 自己试一张照片。"},
  {"id": "music-start", "domain": "music", "title": "录音入门共学：听见环境声与琴声", "description": "手机也能参与，先学会记录与比较声音，不要求购买录音设备。", "host": "沫沫", "date": "11 月 8 日 · 周日 10:00", "cap": 8, "participants": ["momo"], "cover": "assets/activities/music-start.webp", "duration": "45 分钟", "kind": "workshop", "preparation": "准备手机，以及一段自己的弹奏或说话录音。", "outcome": "环境声、主体声音两份对照录音。", "agenda": "认识基础收音 → 对照环境声 → 试着调整距离 → 记下一个待解决的问题。"},
  {"id": "language-start", "domain": "language", "title": "口语入门共学：第一次旅行点餐", "description": "从常见情景开始练习，允许停顿，也允许先听同伴说。", "host": "Theo", "date": "11 月 8 日 · 周日 11:00", "cap": 8, "participants": ["theo"], "cover": "assets/activities/language-start.webp", "duration": "45 分钟", "kind": "workshop", "preparation": "选一家想去的餐厅，写下想说的三句话。", "outcome": "完成一轮点餐情景练习。", "agenda": "示范点餐 → 两人轮流练习 → 换一个需求重说 → 留下自己的表达清单。"},
  {"id": "craft-start", "domain": "life", "title": "手作入门共学：把想法画成小草图", "description": "先认识材料、尺寸和工具，再决定是否动手；本场不进行切割等危险操作。", "host": "乔乔", "date": "11 月 8 日 · 周日 15:00", "cap": 8, "participants": ["qiao"], "cover": "assets/activities/craft-start.webp", "duration": "45 分钟", "kind": "workshop", "preparation": "准备纸笔和材料照片即可。", "outcome": "一张带尺寸的草图与材料清单。", "agenda": "认识材料 → 描述自己的用途 → 标注尺寸 → 讨论下一步需要谁帮助。"}
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
