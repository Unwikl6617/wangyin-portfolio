import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import ElectricBorder from './ElectricBorder'

const heroVideos = ['/assets/hero-showcase.mp4', '/assets/hero-short-clip.mp4', '/assets/hero-star-road.mp4']
const projectMedia = {
  '01': [{ source: '/assets/project-spaceship.mp4', kind: 'video' }, { source: '/assets/project-mecha-dog.mp4', kind: 'video' }, { source: '/assets/project-thirty-seconds.mp4', kind: 'video' }],
  '02': [{ source: '/assets/campus-ai-work.mp4', kind: 'video' }, { source: '/assets/campus-shen-sui.mp4', kind: 'video' }],
  '03': Array.from({ length: 20 }, (_, index) => ({ source: `/assets/ai-gallery-${index + 1}.png`, kind: 'image' })),
}
const projects = [
  { id: '01', type: '视觉系统 / 动态叙事', title: 'AI动画视觉叙事', body: '从概念设定到动态镜头，以 AI 辅助建立可延展的视觉叙事语言。' },
  { id: '02', type: '校园AI作品', title: '校园AI作品', body: '围绕校园创作实践完成的 AI 影像作品，以镜头语言与视觉想象呈现叙事表达。' },
  { id: '03', type: 'AI图集 / 视觉实验', title: 'AI图集作品展示', body: '二十张 AI 图像作品，涵盖人物、场景与风格化视觉实验。' },
]
const capabilities = [
  ['01', 'AI内容生产', '从需求拆解、分镜到素材生成与后期交付，建立稳定的 AI 内容生产链路。'],
  ['02', '视觉创作', '覆盖角色、场景、海报与宣传视觉，在多种风格中保持统一的审美表达。'],
  ['03', '动画流程', '理解动画制作上下游协作，围绕镜头与节奏设计可进入制作流程的视觉资产。'],
  ['04', '团队协同', '将工具使用沉淀为可复用的方法与培训，提升团队创作效率与协同质量。'],
]
const Arrow = () => <span className="arrow">↗</span>

function App() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [heroScan, setHeroScan] = useState(false)
  const [nameScan, setNameScan] = useState(false)
  const [toast, setToast] = useState('')
  const [playerOpen, setPlayerOpen] = useState(false)
  const [projectKey, setProjectKey] = useState('01')
  const [mediaIndex, setMediaIndex] = useState(0)
  const playerRef = useRef(null)
  const wheelLock = useRef(false)
  const items = projectMedia[projectKey]
  const current = items[mediaIndex]
  const nodes = items.length <= 5 ? items.map((_, index) => index) : Array.from({ length: 5 }, (_, offset) => Math.max(0, Math.min(mediaIndex - 2, items.length - 5)) + offset)

  useEffect(() => {
    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.45
      const ids = ['about', 'work', 'ability']
      setActiveSection(ids.reduce((currentId, id) => {
        const node = document.getElementById(id)
        return node && node.offsetTop <= marker ? id : currentId
      }, ''))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!playerOpen) return undefined

    const htmlOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = htmlOverflow
      document.body.style.overflow = bodyOverflow
    }
  }, [playerOpen])
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const copyEmail = async () => { try { await navigator.clipboard.writeText('13662852993@163.com') } catch {} ; notify('Email copied. Contact Wangyin anytime.') }
  const triggerHero = () => { setHeroScan(false); requestAnimationFrame(() => { setHeroScan(true); window.setTimeout(() => setHeroScan(false), 980) }) }
  const triggerName = () => { setNameScan(false); requestAnimationFrame(() => { setNameScan(true); window.setTimeout(() => setNameScan(false), 1300) }) }
  const openProject = (id) => { setProjectKey(id); setMediaIndex(0); setPlayerOpen(true) }
  const closeProject = () => { playerRef.current?.pause(); setPlayerOpen(false) }
  const changeMedia = (direction) => {
    if (wheelLock.current) return
    wheelLock.current = true
    playerRef.current?.pause()
    setMediaIndex((index) => (index + direction + items.length) % items.length)
    window.setTimeout(() => { wheelLock.current = false }, 580)
  }

  return <main>
    {toast && <div className="copy-toast" role="status">{toast}</div>}
    {playerOpen && <div className="project-player" role="dialog" aria-modal="true" onWheel={(event) => { event.preventDefault(); if (Math.abs(event.deltaY) > 10) changeMedia(event.deltaY > 0 ? 1 : -1) }}>
      <div className="project-player-backdrop" onClick={closeProject} />
      <div className="project-player-window">
        <header><span>{current.kind === 'image' ? 'AI图集' : '项目影像'} / {String(mediaIndex + 1).padStart(2, '0')}</span><button type="button" onClick={closeProject}>关闭 ×</button></header>
        <div className="project-player-media" onContextMenu={(event) => event.preventDefault()}>
          {current.kind === 'image' ? <img src={current.source} alt="Project artwork" draggable={false} onContextMenu={(event) => event.preventDefault()} /> : <video ref={playerRef} key={current.source} src={current.source} autoPlay muted playsInline controls controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture draggable={false} onContextMenu={(event) => event.preventDefault()} />}
        </div>
        <footer><div className="project-player-hint">使用鼠标滚轮切换作品</div><div className="project-player-progress"><i style={{ width: `${((mediaIndex + 1) / items.length) * 100}%` }} />{nodes.map((index) => <button key={index} type="button" className={index === mediaIndex ? 'is-active' : ''} onClick={() => { playerRef.current?.pause(); setMediaIndex(index) }} />)}</div></footer>
      </div>
    </div>}

    <section className="hero" id="top">
      <video className="hero-video-showcase" key={heroIndex} autoPlay muted playsInline onEnded={() => setHeroIndex((index) => (index + 1) % heroVideos.length)}><source src={heroVideos[heroIndex]} type="video/mp4" /></video>
      <div className="hero-art hero-finish" aria-hidden="true"><div className="hero-grain" /></div>
      <nav className="nav nav-pinned shell"><a className="wordmark" href="#top">UNWIKL'S WORD</a><div className="nav-links"><a className={activeSection === 'about' ? 'is-active' : ''} href="#about" onClick={() => setActiveSection('about')}>关于我</a><a className={activeSection === 'work' ? 'is-active' : ''} href="#work" onClick={() => setActiveSection('work')}>作品精选</a><a className={activeSection === 'ability' ? 'is-active' : ''} href="#ability" onClick={() => setActiveSection('ability')}>能力体系</a></div><a className="contact-pill" href="mailto:13662852993@163.com">联系我 <Arrow /></a></nav>
      <div className={'hero-signature ' + (heroScan ? 'is-scanning' : '')}><p onPointerLeave={triggerHero}>{['W','A','N','G','Y','I','N'].map((letter, index) => <span data-letter={letter} key={letter + index}>{letter}</span>)}</p><small>You can also call me Unwikl</small></div>
      <aside className="hero-notes"><div className="hero-actions"><a className="hero-action hero-action-primary" href="#about">开始查看 <Arrow /></a><button className="hero-action hero-action-mail" type="button" onClick={copyEmail}>13662852993@163.com</button></div><p className="hero-statement">HUMAN CREATIVITY <span>X</span> ARTIFICIAL INTELLIGENCE</p></aside>
    </section>

    <section className="about section shell" id="about"><div className="section-label"><span>01</span> PROFILE</div><div className="about-grid">
      <ElectricBorder className="portrait-panel" color="#b68aff"><div className="portrait-wrap"><img src="/assets/wangyin-photo.png" alt="Wangyin portrait" draggable={false} onContextMenu={(event) => event.preventDefault()} /><div className="portrait-mark">Unwikl</div></div><p className="portrait-intent">AI DESIGNER | AI PRODUCER | AI DIRECTOR</p></ElectricBorder>
      <div className="about-copy"><div className="about-intro"><p className="eyebrow">HELLO, I'M</p><h2 className={'about-name ' + (nameScan ? 'is-scanning' : '')} onPointerLeave={triggerName}><span className="name-letter" data-letter="王">王</span><span className="name-letter" data-letter="胤">胤</span><span className="about-role" data-role="AI Designer">AI Designer</span></h2><p className="intro">专注于 AI 内容生产与视觉创作，熟悉动画制作流程，通过 AI 工具与设计判断的结合提升团队协同效率。</p></div><div className="education"><span>教育背景</span><div><b>2022.09 - 2026.07</b><b>华南农业大学</b><b>动画专业</b><b>本科</b></div></div><div className="contact-lines"><button className="contact-copy" type="button" onClick={() => notify('WeChat signal saved. Search Unwikl.') }><span>微信</span>Unwikl</button><button className="contact-copy" type="button" onClick={copyEmail}><span>邮箱</span>13662852993@163.com</button><p><span>所在地</span>广州 / 中国</p></div></div>
    </div></section>

    <section className="works section" id="work"><div className="shell"><div className="works-heading"><div className="section-label"><span>02</span> 作品精选</div><h2>作品精选</h2><p>所有作品均只作为求职展示</p></div><div className="project-list">{projects.map((project) => <ElectricBorder className="project-case-panel" color="#b68aff" key={project.id}><article className="project-case"><div className="project-video-slot"><div className="project-video-grid" /><span className="video-index">{project.id}</span><div className="video-placeholder"><i>播放</i><p>项目媒体<br />滚轮查看</p></div></div><div className="project-case-copy"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-summary">{project.body}</p><button type="button" className="project-detail" onClick={() => openProject(project.id)}>查看项目 <Arrow /></button></div></article></ElectricBorder>)}</div></div></section>

    <section className="ability section shell" id="ability"><div className="ability-header"><div className="section-label"><span>03</span> 能力体系</div><h2>让灵感落地<br />让流程更快</h2></div><div className="capability-list">{capabilities.map(([number, title, body]) => <ElectricBorder className="capability-panel" color="#b68aff" key={number}><article className="capability"><span className="cap-number">{number}</span><h3>{title}</h3><p>{body}</p><Arrow /></article></ElectricBorder>)}</div><ElectricBorder className="tool-panel" color="#b68aff"><div className="tool-strip"><span>常用工具</span><p>ChatGPT X ComfyUI X Midjourney X AE</p></div></ElectricBorder></section>

    <section className="footer-cta" id="contact"><div className="footer-noise" /><div className="shell footer-inner"><p className="eyebrow">开启一段对话</p><h2>下一段视觉<br /><em>想象，一起发生。</em></h2><button className="email-link" type="button" onClick={copyEmail}>13662852993@163.com <Arrow /></button><div className="footer-line"><span>2026 WANGYIN</span><a href="#top">返回顶部</a><span>AI设计师 / 广州</span></div></div></section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)




