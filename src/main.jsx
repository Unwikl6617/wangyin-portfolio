import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './style.css'
import ElectricBorder from './ElectricBorder'

const heroVideos = ['/assets/hero-showcase-web.mp4', '/assets/hero-short-clip-web.mp4', '/assets/hero-star-road-web.mp4']
const projectMedia = {
  '01': [{ source: '/assets/project-spaceship-web.mp4', kind: 'video' }, { source: '/assets/project-mecha-dog-web.mp4', kind: 'video' }, { source: '/assets/project-thirty-seconds-web.mp4', kind: 'video' }, { source: '/assets/project-atmosphere-render-web.mp4', kind: 'video' }, { source: '/assets/project-bug-revision-web.mp4', kind: 'video' }],
  '02': [{ source: '/assets/campus-ai-work-stream-web.mp4', kind: 'video' }, { source: '/assets/campus-shen-sui-stream-web.mp4', kind: 'video' }],
  '03': Array.from({ length: 20 }, (_, index) => ({ source: `/assets/ai-gallery-${index + 1}.webp`, kind: 'image' })),
}
const otherWorks = [
  ...['character-01.jpg','character-02.jpg','character-03.jpg','character-04.jpg','character-05.jpg'].map(source => ({ source: '/assets/other-works/' + source, kind: 'image' })),
  ...['pixel-yuner-standing.png','pixel-yuner-idle.gif','pixel-yuner-run.gif','pixel-yuner-jump.gif','pixel-yuner-combo.gif','pixel-qi-standing.png','pixel-qi-idle-new.gif','pixel-fa-standing.png','pixel-fa-idle.gif','pixel-rabe-attack.gif'].map(source => ({ source: '/assets/other-works/' + source, kind: 'image' })),
]
const projects = [
  { id: '01', type: 'VISUAL SYSTEM / MOTION', title: 'AI动画视觉叙事', body: '探索全流程AI动画可行性，在有限的AI技术基础上探索AI与传统流程的结合运用。' },
  { id: '02', type: 'CAMPUS AI / SELECTED WORK', title: '校园AI作品', body: '围绕校园创作实践完成的 AI 影像作品，以镜头语言与视觉想象呈现叙事表达。' },
  { id: '03', type: 'AI IMAGE / COLLECTION', title: 'AI图集作品展示', body: '二十张 AI 图像作品，涵盖人物、场景与风格化视觉实验。' },
]
const moreProjects = [
  { number: '01', title: '国漫项目 · AI技术支持', body: '参与知名国漫《剑来2》的制作，承担 AI 技术支持与产出工作，主要参与水墨风格化制作、动态海报制作、二维动画《楚夫人》短片与“十三对十三”故事水墨风格化过场动画等；同时参与《诛仙4》《青山》等多个公司内部项目的 AI 制作。', tags: ['剑来2', '水墨动画', '动态海报'] },
  { number: '02', title: '《星路》 · 全流程研发', body: '作为 AI 全流程研发负责人之一，探索动画 AI 制作的更多可能性。负责 AI 番剧《星路》的 AI 制作，从前期测试、概念设计、资产制作、分镜设计、AI 原画、AI 视频到后期，全流程深度参与制作；《星路》PV 已上线。', tags: ['星路', '全流程研发', 'AI番剧'] },
  { number: '03', title: '漫剧与概念短片 · 美术制作', body: '参与多款漫剧和概念短片制作，主要负责美术资产、分镜设计与风格审核等。已上线的部分作品包括《苟王仙帝穿越高中生》《别让我守身如玉啊 这系统他针对单身狗》等。', tags: ['美术资产', '分镜设计', '风格审核'] },
]
const capabilities = [
  ['01', 'AI内容生产', '从需求拆解、分镜到素材生成与后期交付，建立稳定的 AI 内容生产链路。'],
  ['02', '视觉创作', '覆盖角色、场景、海报与宣传视觉，在多种风格中保持统一的审美表达。'],
  ['03', '动画流程', '理解动画制作上下游协作，围绕镜头与节奏设计可进入制作流程的视觉资产。'],
  ['04', '团队协同', '将工具使用沉淀为可复用的方法与培训，提升团队创作效率与协同质量。'],
]
const Arrow = () => <span className="arrow">↗</span>

const skillSignals = [
  { id: 'ai-pipeline', label: 'AI全流程', x: '10%', y: '19%', angle: 35, delay: '0s' },
  { id: 'ai-delivery', label: 'AI落地', x: '29%', y: '7%', angle: 70, delay: '.9s' },
  { id: 'aigc-practice', label: 'AIGC实践', x: '72%', y: '10%', angle: 110, delay: '1.8s' },
  { id: 'workflow', label: '流程搭建', x: '90%', y: '28%', angle: 150, delay: '2.7s' },
  { id: 'tools', label: '工具探索', x: '89%', y: '72%', angle: -150, delay: '3.6s' },
  { id: 'efficiency', label: '效率优化', x: '71%', y: '90%', angle: -116, delay: '4.5s' },
  { id: 'style', label: '风格把控', x: '27%', y: '89%', angle: -64, delay: '5.4s' },
  { id: 'content', label: '内容生产', x: '8%', y: '67%', angle: -27, delay: '6.3s' },
]

function SkillConvergence() {
  const [dragging, setDragging] = useState('')
  const [positions, setPositions] = useState({})
  const [returning, setReturning] = useState({})
  const releaseTimers = useRef({})
  const moveSignal = (event, id) => {
    const bounds = event.currentTarget.parentElement.getBoundingClientRect()
    const x = Math.max(4, Math.min(96, ((event.clientX - bounds.left) / bounds.width) * 100))
    const y = Math.max(7, Math.min(93, ((event.clientY - bounds.top) / bounds.height) * 100))
    setPositions((current) => ({ ...current, [id]: { x, y } }))
  }
  const startDrag = (event, id) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    window.clearTimeout(releaseTimers.current[id])
    setReturning((current) => ({ ...current, [id]: false }))
    setDragging(id)
    moveSignal(event, id)
  }
  const endDrag = (event, id) => {
    if (dragging !== id) return
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    setDragging('')
    setReturning((current) => ({ ...current, [id]: true }))
    setPositions((current) => ({ ...current, [id]: { x: 50, y: 50 } }))
    releaseTimers.current[id] = window.setTimeout(() => {
      setPositions((current) => { const next = { ...current }; delete next[id]; return next })
      setReturning((current) => { const next = { ...current }; delete next[id]; return next })
    }, 760)
  }
  return <div className="skill-convergence" aria-label="能力关键词汇聚互动区域">
    <div className="skill-convergence-intro"><span>04</span><p>CORE SIGNALS / DRAG TO EXPLORE</p></div>
    <div className="skill-field" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--grid-x', `${((event.clientX - bounds.left - bounds.width / 2) * .045).toFixed(1)}px`); event.currentTarget.style.setProperty('--grid-y', `${((event.clientY - bounds.top - bounds.height / 2) * .045).toFixed(1)}px`) }}><div className="skill-field-grid" aria-hidden="true" />
      {skillSignals.map((signal) => {
        const position = positions[signal.id]
        const isDragging = dragging === signal.id
        const isReturning = returning[signal.id]
        return <button key={signal.id} type="button" className={'skill-arrow ' + (isDragging ? 'is-dragging ' : '') + (isReturning ? 'is-returning' : '')} style={{ '--start-x': signal.x, '--start-y': signal.y, '--angle': `${signal.angle}deg`, '--delay': signal.delay, ...(position ? { left: `${position.x}%`, top: `${position.y}%` } : {}) }} onPointerDown={(event) => startDrag(event, signal.id)} onPointerMove={(event) => { if (dragging === signal.id) moveSignal(event, signal.id) }} onPointerUp={(event) => endDrag(event, signal.id)} onPointerCancel={(event) => endDrag(event, signal.id)} aria-label={`拖动${signal.label}`}><span className="skill-arrow-label">{signal.label}</span></button>
      })}
      <div className="skill-core" aria-label="王胤头像"><div className="skill-core-rings" aria-hidden="true" /><img src="/assets/wangyin-photo.png" alt="王胤" draggable={false} /><span>WANGYIN</span></div>
    </div>
  </div>
}
function App() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [heroScan, setHeroScan] = useState(false)
  const [nameScan, setNameScan] = useState(false)
  const [toast, setToast] = useState('')
  const [playerOpen, setPlayerOpen] = useState(false)
  const [projectKey, setProjectKey] = useState('01')
  const [mediaIndex, setMediaIndex] = useState(0)
  const [rippleProject, setRippleProject] = useState('')
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const playerRef = useRef(null)
  const mediaProgressRef = useRef({})
  const wheelLock = useRef(false)
  const activeSectionRef = useRef('')
  const appRef = useRef(null)
  const galleryRailRef = useRef(null)
  const galleryPausedRef = useRef(false)
  const items = projectMedia[projectKey]
  const current = items[mediaIndex]
  const nodes = items.length <= 5 ? items.map((_, index) => index) : Array.from({ length: 5 }, (_, offset) => Math.max(0, Math.min(mediaIndex - 2, items.length - 5)) + offset)

  useEffect(() => {
    const blockEvent = (event) => event.preventDefault()
    const blockKeys = (event) => {
      if ((event.ctrlKey || event.metaKey) && ['c', 's', 'u', 'p'].includes(event.key.toLowerCase())) event.preventDefault()
    }
    document.addEventListener('contextmenu', blockEvent)
    document.addEventListener('copy', blockEvent)
    document.addEventListener('cut', blockEvent)
    document.addEventListener('dragstart', blockEvent)
    document.addEventListener('keydown', blockKeys)
    return () => {
      document.removeEventListener('contextmenu', blockEvent)
      document.removeEventListener('copy', blockEvent)
      document.removeEventListener('cut', blockEvent)
      document.removeEventListener('dragstart', blockEvent)
      document.removeEventListener('keydown', blockKeys)
    }
  }, [])
  useEffect(() => {
    let frame = 0
    const update = () => {
      const marker = window.scrollY + window.innerHeight * 0.45
      const ids = ['about', 'work', 'ability']
      const nextSection = ids.reduce((currentId, id) => {
        const node = document.getElementById(id)
        return node && node.offsetTop <= marker ? id : currentId
      }, '')
      if (nextSection !== activeSectionRef.current) {
        activeSectionRef.current = nextSection
        setActiveSection(nextSection)
      }
    }
    const requestUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }
    window.addEventListener('scroll', requestUpdate, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })
    const ctx = gsap.context(() => {
      const softEase = 'power4.out'
      const galleryCards = gsap.utils.toArray('.project-case-panel')
      const mediaSlots = gsap.utils.toArray('.project-video-slot')

      const opening = gsap.timeline({ defaults: { ease: softEase } })
      opening
        .set('.nav.nav-pinned', { autoAlpha: 0, y: -28 })
        .set('.hero-video-showcase', { scale: 1.16, filter: 'brightness(.58) contrast(1.12)' })
        .set('.hero-signature', { clipPath: 'inset(0 0 100% 0)' })
        .set('.hero-signature p span', { autoAlpha: 0, yPercent: 132, scaleY: 1.38, transformOrigin: '50% 100%' })
        .set('.hero-signature small', { autoAlpha: 0, y: 20 })
        .set('.hero-notes', { autoAlpha: 0, y: 48 })
        .to('.hero-video-showcase', { scale: 1, filter: 'brightness(1) contrast(1)', duration: 2.45 }, 0)
        .to('.nav.nav-pinned', { autoAlpha: 1, y: 0, duration: 1 }, .18)
        .to('.hero-signature', { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.inOut' }, .42)
        .to('.hero-signature p span', { autoAlpha: 1, yPercent: 0, scaleY: 1, duration: 1.35, stagger: .085 }, .52)
        .to('.hero-signature small', { autoAlpha: 1, y: 0, duration: .8 }, 1.18)
        .to('.hero-notes', { autoAlpha: 1, y: 0, duration: 1.05 }, 1.3)

      gsap.from('.about .section-label', {
        x: -84, autoAlpha: 0, duration: 1.25, ease: softEase,
        scrollTrigger: { trigger: '.about', start: 'top 76%', once: true },
      })
      gsap.from('.portrait-wrap', {
        clipPath: 'inset(0 0 100% 0)', scale: 1.1, duration: 1.55, ease: 'power4.inOut',
        scrollTrigger: { trigger: '.about-grid', start: 'top 76%', once: true },
      })
      gsap.to('.portrait-wrap img', {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1.25 },
      })
      gsap.from('.about-copy > *', {
        y: 96, autoAlpha: 0, duration: 1.18, stagger: .15, ease: softEase,
        scrollTrigger: { trigger: '.about-copy', start: 'top 78%', once: true },
      })

      gsap.from('.works-heading > *', {
        y: 120, scaleY: 1.28, autoAlpha: 0, duration: 1.3, stagger: .13,
        transformOrigin: '50% 100%', ease: softEase,
        scrollTrigger: { trigger: '.works-heading', start: 'top 78%', once: true },
      })
      galleryCards.forEach((card, index) => {
        gsap.from(card, {
          y: 150, scale: .96, autoAlpha: 0, duration: 1.35, delay: index * .06, ease: softEase,
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        })
      })
      mediaSlots.forEach((slot) => {
        gsap.from(slot, {
          clipPath: 'inset(0 0 100% 0)', scale: 1.08, duration: 1.4, ease: 'power4.inOut',
          scrollTrigger: { trigger: slot, start: 'top 80%', once: true },
        })
      })
      gsap.to('.project-video-grid', {
        yPercent: -9, ease: 'none',
        scrollTrigger: { trigger: '.project-list', start: 'top bottom', end: 'bottom top', scrub: 1.4 },
      })

      gsap.from('.other-works-head > *', {
        y: 96, scaleY: 1.22, autoAlpha: 0, duration: 1.18, stagger: .13,
        transformOrigin: '50% 100%', ease: softEase,
        scrollTrigger: { trigger: '.other-works', start: 'top 78%', once: true },
      })
      gsap.from('.other-work-card', {
        scale: .97, autoAlpha: 0, duration: 1.12, stagger: .07,
        transformOrigin: '50% 100%', ease: 'power4.out',
        scrollTrigger: { trigger: '.other-works-rail', start: 'top 80%', once: true },
      })
      gsap.from('.more-projects-head > *', {
        y: 106, scaleY: 1.25, autoAlpha: 0, duration: 1.25, stagger: .14,
        transformOrigin: '50% 100%', ease: softEase,
        scrollTrigger: { trigger: '.more-projects', start: 'top 78%', once: true },
      })
      gsap.from('.more-project-card', {
        scale: .96, autoAlpha: 0, duration: 1.28, stagger: .12, ease: softEase,
        scrollTrigger: { trigger: '.more-projects-rail', start: 'top 80%', once: true },
      })
      gsap.from('.ability-header > *', {
        y: 118, scaleY: 1.25, autoAlpha: 0, duration: 1.3, stagger: .16,
        transformOrigin: '50% 100%', ease: softEase,
        scrollTrigger: { trigger: '.ability-header', start: 'top 78%', once: true },
      })
      gsap.from('.capability-panel', {
        autoAlpha: 0, duration: 1.08, stagger: .14, ease: softEase,
        scrollTrigger: { trigger: '.capability-list', start: 'top 76%', once: true },
      })
      gsap.from('.tool-panel', {
        y: 64, autoAlpha: 0, duration: 1, ease: softEase,
        scrollTrigger: { trigger: '.tool-panel', start: 'top 86%', once: true },
      })

      gsap.from('.footer-cta .eyebrow', {
        x: -54, autoAlpha: 0, duration: 1, ease: softEase,
        scrollTrigger: { trigger: '.footer-cta', start: 'top 70%', once: true },
      })
      gsap.from('.footer-cta h2', {
        clipPath: 'inset(0 0 100% 0)', y: 126, scaleY: 1.24, autoAlpha: 0, duration: 1.55,
        transformOrigin: '50% 100%', ease: 'power4.inOut',
        scrollTrigger: { trigger: '.footer-cta', start: 'top 70%', once: true },
      })
      gsap.from('.footer-cta .email-link, .footer-cta .footer-line', {
        y: 54, autoAlpha: 0, duration: .95, stagger: .14, ease: softEase,
        scrollTrigger: { trigger: '.footer-cta', start: 'top 58%', once: true },
      })
    }, appRef)

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      window.clearTimeout(refreshId)
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    const rail = galleryRailRef.current
    if (!rail) return undefined
    const handleWheel = (event) => {
      event.preventDefault()
      const maxScroll = rail.scrollWidth - rail.clientWidth
      if (maxScroll <= 0) return
      const delta = event.deltaY + event.deltaX
      rail.scrollLeft = Math.max(0, Math.min(maxScroll, rail.scrollLeft + delta))
    }
    rail.addEventListener('wheel', handleWheel, { passive: false })
    return () => rail.removeEventListener('wheel', handleWheel)
  }, [])
  useEffect(() => {
    if (!playerOpen && !galleryOpen) return undefined

    const htmlOverflow = document.documentElement.style.overflow
    const bodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = htmlOverflow
      document.body.style.overflow = bodyOverflow
    }
  }, [playerOpen, galleryOpen])
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const copyEmail = async () => { try { await navigator.clipboard.writeText('3592875905@qq.com') } catch {} ; notify('已复制王胤的专属信号，欢迎随时联系~') }
  const triggerHero = () => { setHeroScan(false); requestAnimationFrame(() => { setHeroScan(true); window.setTimeout(() => setHeroScan(false), 980) }) }
  const triggerName = () => { setNameScan(false); requestAnimationFrame(() => { setNameScan(true); window.setTimeout(() => setNameScan(false), 1300) }) }
  const openProject = (id) => { mediaProgressRef.current = {}; setProjectKey(id); setMediaIndex(0); setPlayerOpen(true) }
  const openProjectFromOrb = (id, event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--ripple-x', (event.clientX - bounds.left) + 'px')
    event.currentTarget.style.setProperty('--ripple-y', (event.clientY - bounds.top) + 'px')
    setRippleProject('')
    requestAnimationFrame(() => {
      setRippleProject(id)
      window.setTimeout(() => {
        openProject(id)
        setRippleProject('')
      }, 420)
    })
  }
  const openOtherWork = (index) => { setGalleryIndex(index); setGalleryOpen(true) }

  const changeOtherWork = (direction) => setGalleryIndex((index) => (index + direction + otherWorks.length) % otherWorks.length)
  const saveMediaProgress = () => {
    const video = playerRef.current
    if (!video || !Number.isFinite(video.currentTime)) return
    mediaProgressRef.current[current.source] = { time: video.currentTime, wasPlaying: !video.paused && !video.ended }
  }
  const closeProject = () => { saveMediaProgress(); playerRef.current?.pause(); setPlayerOpen(false) }
  const selectMedia = (index) => { saveMediaProgress(); playerRef.current?.pause(); setMediaIndex(index) }
  const changeMedia = (direction) => {
    if (wheelLock.current) return
    wheelLock.current = true
    saveMediaProgress()
    playerRef.current?.pause()
    setMediaIndex((index) => (index + direction + items.length) % items.length)
    window.setTimeout(() => { wheelLock.current = false }, 580)
  }

  return <main ref={appRef}>
    {toast && <div className="copy-toast" role="status">{toast}</div>}
    {galleryOpen && <div className="other-work-lightbox" role="dialog" aria-modal="true" onWheel={(event) => { event.preventDefault(); if (Math.abs(event.deltaY) > 10) changeOtherWork(event.deltaY > 0 ? 1 : -1) }}>
      <div className="other-work-lightbox-backdrop" onClick={() => setGalleryOpen(false)} />
      <div className="other-work-lightbox-window"><button type="button" onClick={() => setGalleryOpen(false)}>关闭 ×</button><img src={otherWorks[galleryIndex].source} alt="" draggable={false} /><p>滚动鼠标切换作品 · {String(galleryIndex + 1).padStart(2, '0')} / {String(otherWorks.length).padStart(2, '0')}</p></div>
    </div>}    {playerOpen && <div className="project-player" role="dialog" aria-modal="true" onWheel={(event) => { event.preventDefault(); if (Math.abs(event.deltaY) > 10) changeMedia(event.deltaY > 0 ? 1 : -1) }}>
      <div className="project-player-backdrop" onClick={closeProject} />
      <div className="project-player-window">
        <header><span>{current.kind === 'image' ? 'AI图集' : '项目影像'} / {String(mediaIndex + 1).padStart(2, '0')}</span><button type="button" onClick={closeProject}>关闭 ×</button></header>
        <div className="project-player-media" onContextMenu={(event) => event.preventDefault()}>
          {current.kind === 'image' ? <img src={current.source} alt="Project artwork" decoding="async" draggable={false} onContextMenu={(event) => event.preventDefault()} /> : <video ref={playerRef} key={current.source} src={current.source} playsInline preload="metadata" controls controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture draggable={false} onContextMenu={(event) => event.preventDefault()} onLoadedMetadata={(event) => { const saved = mediaProgressRef.current[current.source]; if (saved?.time) event.currentTarget.currentTime = Math.min(saved.time, Math.max(0, event.currentTarget.duration - 0.1)) }} onTimeUpdate={saveMediaProgress} onPause={saveMediaProgress} onEnded={(event) => { mediaProgressRef.current[current.source] = { time: 0, wasPlaying: false }; event.currentTarget.currentTime = 0 }} />}
        </div>
        <footer><div className="project-player-hint">使用鼠标滚轮切换作品</div><div className="project-player-progress"><i style={{ width: `${((mediaIndex + 1) / items.length) * 100}%` }} />{nodes.map((index) => <button key={index} type="button" className={index === mediaIndex ? 'is-active' : ''} onClick={() => selectMedia(index)} />)}</div></footer>
      </div>
    </div>}

    <section className="hero" id="top">
      <video className="hero-video-showcase" key={heroIndex} autoPlay muted playsInline preload="metadata" onEnded={() => setHeroIndex((index) => (index + 1) % heroVideos.length)}><source src={heroVideos[heroIndex]} type="video/mp4" /></video>
      <div className="hero-art hero-finish" aria-hidden="true"><div className="hero-grain" /></div>
      <nav className="nav nav-pinned shell"><a className="wordmark" href="#top" onClick={(event) => { event.preventDefault(); window.history.replaceState(null, '', '#top'); window.scrollTo({ top: 0, behavior: 'smooth' }); notify('别犹豫，他真的很懂AI') }}>UNWIKL'S WORD</a><div className="nav-links"><a className={activeSection === 'about' ? 'is-active' : ''} href="#about" onClick={() => setActiveSection('about')}>关于我</a><a className={activeSection === 'work' ? 'is-active' : ''} href="#work" onClick={() => setActiveSection('work')}>作品精选</a><a className={activeSection === 'ability' ? 'is-active' : ''} href="#ability" onClick={() => setActiveSection('ability')}>能力体系</a></div><a className="contact-pill" href="mailto:3592875905@qq.com">联系我 <Arrow /></a></nav>
      <div className={'hero-signature ' + (heroScan ? 'is-scanning' : '')}><p onPointerLeave={triggerHero}>{['W','A','N','G','Y','I','N'].map((letter, index) => <span data-letter={letter} key={letter + index}>{letter}</span>)}</p><small>You can also call me Unwikl</small></div>
      <aside className="hero-notes"><div className="hero-actions"><a className="hero-action hero-action-primary" href="#about">开始查看 <Arrow /></a><button className="hero-action hero-action-mail" type="button" onClick={copyEmail}>3592875905@qq.com</button></div><p className="hero-statement">HUMAN CREATIVITY <span>X</span> ARTIFICIAL INTELLIGENCE</p></aside>
    </section><section className="about section shell" id="about"><div className="section-label"><span>01</span> PROFILE</div><div className="about-grid">
      <ElectricBorder className="portrait-panel" color="#b68aff"><div className="portrait-wrap"><img src="/assets/wangyin-photo.png" alt="Wangyin portrait" draggable={false} onContextMenu={(event) => event.preventDefault()} /><div className="portrait-mark">Unwikl</div></div><p className="portrait-intent">AI设计师｜AI制片｜AI导演向</p></ElectricBorder>
      <div className="about-copy"><div className="about-intro"><p className="eyebrow">HELLO, I'M</p><h2 className={'about-name ' + (nameScan ? 'is-scanning' : '')} onPointerLeave={triggerName}><span className="name-letter" data-letter="王">王</span><span className="name-letter" data-letter="胤">胤</span><span className="about-role" data-role="AI Designer">AI Designer</span></h2><p className="intro">专注于 AI 内容生产与视觉创作，熟悉动画制作流程，通过 AI 工具与设计判断的结合提升团队协同效率。</p></div><div className="education"><span>教育背景</span><div><b>2022.09 - 2026.07</b><b>华南农业大学</b><b>动画专业</b><b>本科</b></div></div><div className="contact-lines"><button className="contact-copy" type="button" onClick={() => notify('已复制王胤的专属信号，欢迎随时联系~') }><span>微信</span>Unwikl</button><button className="contact-copy" type="button" onClick={copyEmail}><span>邮箱</span>3592875905@qq.com</button><p><span>所在地</span>广州 / 中国</p></div></div>
    </div></section>

    <section className="works section" id="work"><div className="shell"><div className="works-heading"><div className="section-label"><span>02</span> SELECTED WORK</div><h2>精选作品</h2><p>所有作品均只作为求职展示</p></div><div className="project-list">{projects.map((project) => <ElectricBorder className="project-case-panel" color="#b68aff" variant="organic" key={project.id}><article className="project-case"><button type="button" className={'project-video-slot ' + (rippleProject === project.id ? 'is-rippling' : '')} aria-label={`浏览${project.title}`} onClick={(event) => openProjectFromOrb(project.id, event)}><div className="project-video-grid" /><span className="video-index">{project.id}</span><span className="water-ring water-ring-one" aria-hidden="true" /><span className="water-ring water-ring-two" aria-hidden="true" /><span className="water-ring water-ring-three" aria-hidden="true" /><span className="click-ripple" aria-hidden="true" /><div className="video-placeholder"><i>播放</i><p>点击浏览作品<br />滚轮切换内容</p></div></button><div className="project-case-copy"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-summary">{project.body}</p><button type="button" className="project-detail" onClick={() => openProject(project.id)}>查看项目 <Arrow /></button></div></article></ElectricBorder>)}</div></div></section>

      <section className="other-works"><div className="other-works-head"><h2>个人娱乐作品</h2><p>均为个人兴趣爱好</p></div><div className="other-works-rail" ref={galleryRailRef}><div className="other-works-track">{otherWorks.map((work, index) => <button type="button" className="other-work-card" key={work.source + index} onClick={() => openOtherWork(index)}><img src={work.source} alt="" loading="lazy" decoding="async" draggable={false} /></button>)}</div></div><div className="more-projects"><div className="more-projects-head"><div><p>SELECTED EXTENSIONS</p><h2>更多项目作品</h2></div><span>横向滚动查看 ↗</span></div><div className="more-projects-rail" onWheel={(event) => { event.preventDefault(); event.currentTarget.scrollLeft += event.deltaY + event.deltaX }}><div className="more-projects-track">{moreProjects.map((project) => <article className="more-project-card" key={project.number}><span className="more-project-number">{project.number}</span><div className="more-project-content"><h3>{project.title}</h3><p>{project.body}</p><div className="more-project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></div></div></section>    <section className="ability section shell" id="ability"><div className="ability-header"><div className="section-label"><span>03</span> SYSTEM</div><h2>让灵感落地<br />让流程更快</h2></div><div className="capability-list">{capabilities.map(([number, title, body]) => <ElectricBorder className="capability-panel" color="#b68aff" key={number}><article className="capability"><span className="cap-number">{number}</span><h3>{title}</h3><p>{body}</p><Arrow /></article></ElectricBorder>)}</div></section>

    <SkillConvergence />
    <section className="footer-cta" id="contact"><div className="footer-noise" /><div className="shell footer-inner"><p className="eyebrow">开启一段对话</p><h2>一起开启<br /><em>下一段旅程</em></h2><button className="email-link" type="button" onClick={copyEmail}>3592875905@qq.com <Arrow /></button><div className="footer-line"><span>2026 WANGYIN</span><a href="#top">返回顶部</a><span>AI设计师 / 广州</span></div></div></section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)








