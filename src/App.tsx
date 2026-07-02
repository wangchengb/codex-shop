import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Check, ChevronRight, Clock3, Flame, MapPin, Menu, Phone, Quote, Star, X } from 'lucide-react'
import { dishes, restaurant, reviews, type DishCategory, type ReservationForm } from './data'

const categories: DishCategory[] = ['全部', '招牌', '热菜', '凉菜', '主食']
const initialForm: ReservationForm = { name: '', phone: '', date: '', time: '', guests: '2', note: '' }

function App() {
  const [category, setCategory] = useState<DishCategory>('全部')
  const [menuOpen, setMenuOpen] = useState(false)
  const [reserveOpen, setReserveOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const filteredDishes = useMemo(() => category === '全部' ? dishes : dishes.filter(d => d.category === category), [category])
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (!reserveOpen) return
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setReserveOpen(false)
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [reserveOpen])

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('revealed')), { threshold: .12 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [category])

  const openReservation = () => { setSuccess(false); setError(''); setReserveOpen(true); setMenuOpen(false) }
  const closeReservation = () => { if (!submitting) setReserveOpen(false) }
  const updateForm = (key: keyof ReservationForm, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const submitReservation = async (e: FormEvent) => {
    e.preventDefault(); setError('')
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) return setError('请把姓名、电话、日期和时间填写完整。')
    if (!/^1[3-9]\d{9}$/.test(form.phone)) return setError('请输入正确的 11 位手机号码。')
    if (form.date < today) return setError('订位日期不能早于今天。')
    const guests = Number(form.guests)
    if (guests < 1 || guests > 12) return setError('线上订位支持 1—12 位，更多人数请电话联系。')
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 900))
    setSubmitting(false); setSuccess(true); setForm(initialForm)
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="返回首页"><span className="brand-stamp">巷火</span><span>川菜馆<small>XIANG HUO · CHENGDU</small></span></a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="主导航">
        <button onClick={() => scrollTo('menu')}>吃什么</button><button onClick={() => scrollTo('story')}>我们的火</button><button onClick={() => scrollTo('reviews')}>街坊说</button><button onClick={() => scrollTo('visit')}>来吃饭</button>
      </nav>
      <button className="reserve-small" onClick={openReservation}>马上订位 <ArrowRight size={16}/></button>
      <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? '关闭菜单' : '打开菜单'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="top">
        <img src="/images/hero-sichuan.webp" alt="红灯笼下热气腾腾的水煮牛肉" className="hero-image" />
        <div className="hero-grain" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> 今日有火 · 营业至 22:30</div>
          <p className="hero-kicker">成都巷子里的那口锅气</p>
          <h1>一口<span>热辣</span><br/>一桌成都</h1>
          <p className="hero-desc">花椒先开路，豆瓣再压阵。<br/>不摆谱，只管让你吃得痛快。</p>
          <div className="hero-actions"><button className="btn primary" onClick={openReservation}>占个好位置 <ArrowRight/></button><button className="btn ghost" onClick={() => scrollTo('menu')}>先看菜单 <ArrowDown/></button></div>
        </div>
        <div className="hero-note"><strong>成都味</strong><span>热油现泼<br/>每日现炒</span></div>
        <div className="ticker"><div>花椒要麻 · 辣椒要香 · 镬气要足 · 酒要冰 · 饭要热 · <span>今天也要好好吃饭</span> · 花椒要麻 · 辣椒要香 · 镬气要足 ·</div></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-head" data-reveal><div><span className="section-no">01 / 点 菜</span><h2>招牌硬菜<br/><em>放开吃。</em></h2></div><p>菜没有花架子，火候不能有半点马虎。<br/>辣度可以商量，香味绝不打折。</p></div>
        <div className="filter-row" role="group" aria-label="菜品分类">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="dish-grid">{filteredDishes.map((dish, index) => <article className="dish-card" data-reveal key={dish.id} style={{'--i': index} as React.CSSProperties}>
          <div className={`dish-image dish-image-${dish.id}`} role="img" aria-label={`${dish.name} 菜品照片`} />
          <div className="dish-top"><span className="dish-index">0{dish.id}</span><span className="dish-mark">{dish.mark}</span></div>
          <div className="pepper-row" aria-label={`辣度 ${dish.spicy} 级`}>{[1,2,3].map(n => <Flame key={n} size={16} fill={n <= dish.spicy ? 'currentColor' : 'none'} className={n <= dish.spicy ? '' : 'muted'}/>)}</div>
          <h3>{dish.name}</h3><p>{dish.subtitle}</p><div className="dish-foot"><span>{dish.category}</span><strong><small>¥</small>{dish.price}</strong></div>
        </article>)}</div>
      </section>

      <section className="story-section" id="story">
        <div className="story-image-wrap" data-reveal><img src="/images/sichuan-feast.webp" alt="木桌上的麻婆豆腐、干锅花菜和红油抄手"/><span className="image-label">锅一响<br/>心就痒</span></div>
        <div className="story-copy" data-reveal><span className="section-no light">02 / 我 们 的 火</span><p className="brush">辣不是目的，<br/>香才是本事。</p><h2>我们相信，真正的川菜<br/>有脾气，也有人情味。</h2><p>每天早上九点，师傅先吊高汤，再炒一锅当天的红油。豆瓣用郫县的，花椒认准汉源，泡菜坛子则跟着我们搬过三次家。</p><p>巷火没有预制菜。该煨的慢慢煨，该爆的猛火爆。端上桌的每一盘，都得带着锅里的脾气。</p>
          <div className="ingredient-list"><span><b>01</b> 汉源花椒</span><span><b>02</b> 郫县豆瓣</span><span><b>03</b> 当日鲜切</span></div>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="section-head compact" data-reveal><div><span className="section-no">03 / 街 坊 说</span><h2>嘴巴不会<br/><em>说假话。</em></h2></div><div className="rating"><strong>4.9</strong><span>{[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor"/>)}<small>来自 1,286 条食客评价</small></span></div></div>
        <div className="reviews-grid">{reviews.map((review, i) => <article className={`review-card ${i === 0 ? 'review-card-featured' : ''}`} data-reveal key={review.name}>
          {i === 0 && <figure className="review-photo"><img src="/images/review-boiled-beef.png" alt="食客在餐桌上随手拍下的水煮牛肉"/><figcaption>食客现场拍摄 · 水煮牛肉</figcaption></figure>}
          <div className="review-content"><Quote size={38}/><p>“{review.quote}”</p><footer><div className="avatar">{review.name[0]}</div><div><strong>{review.name}</strong><span>{review.source}</span></div><time>{review.date}</time></footer></div><span className="review-number">0{i+1}</span>
        </article>)}</div>
      </section>

      <section className="visit-section" id="visit">
        <div className="visit-copy" data-reveal><span className="section-no light">04 / 来 吃 饭</span><h2>饭点见，<br/><em>给你留位置。</em></h2><p>巷子不大，香味会带路。<br/>周五、周六晚市建议提前订位。</p><button className="btn yellow" onClick={openReservation}>马上订一桌 <ArrowRight/></button></div>
        <div className="visit-details" data-reveal><div><MapPin/><span>地址 ADDRESS</span><strong>{restaurant.address}</strong><a href="#map-note">查看到店提示 <ChevronRight size={15}/></a></div><div><Clock3/><span>营业 HOURS</span>{restaurant.hours.map(h => <strong key={h}>{h}</strong>)}<small>每周一店休，节假日另行通知</small></div><div><Phone/><span>电话 PHONE</span><strong>{restaurant.phone}</strong><a href={`tel:${restaurant.phone.replace(/\D/g, '')}`}>打电话 <ChevronRight size={15}/></a></div></div>
        <div className="map-sketch" id="map-note" aria-label="到店路线示意图"><div className="road r1">东风路</div><div className="road r2">椒香里</div><div className="map-pin"><Flame fill="currentColor"/><span>巷火</span></div><span className="map-hint">地铁 2 号线春熙路站<br/>C 口步行约 8 分钟</span></div>
      </section>
    </main>

    <footer className="footer"><div className="footer-logo">巷火<span>XIANG HUO</span></div><p>此网站为概念设计展示，品牌、地址及联系方式均为虚构。</p><span>© 2026 巷火川菜馆</span></footer>

    {reserveOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && closeReservation()} role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="reserve-title">
        <button ref={closeButtonRef} className="modal-close" onClick={closeReservation} aria-label="关闭订位窗口"><X/></button>
        {!success ? <><span className="section-no">留 个 位 置</span><h2 id="reserve-title">今晚，吃点好的。</h2><p>提交后即为演示预约，不会保存或发送个人信息。</p>
          <form onSubmit={submitReservation} noValidate>
            <div className="form-grid"><label>怎么称呼 *<input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="你的名字" autoFocus/></label><label>手机号码 *<input value={form.phone} onChange={e => updateForm('phone', e.target.value)} inputMode="numeric" maxLength={11} placeholder="11 位手机号"/></label><label>哪一天 *<input type="date" min={today} value={form.date} onChange={e => updateForm('date', e.target.value)}/></label><label>几点到 *<select value={form.time} onChange={e => updateForm('time', e.target.value)}><option value="">请选择</option><option>11:30</option><option>12:30</option><option>17:30</option><option>18:30</option><option>19:30</option><option>20:30</option></select></label><label>几位客人 *<input type="number" min="1" max="12" value={form.guests} onChange={e => updateForm('guests', e.target.value)}/></label><label className="wide">有话捎给我们<input value={form.note} onChange={e => updateForm('note', e.target.value)} placeholder="忌口、儿童椅、庆祝纪念日……"/></label></div>
            {error && <div className="form-error" role="alert">{error}</div>}<button className="submit-btn" disabled={submitting}>{submitting ? '正在留位…' : '确认订位'} <ArrowRight/></button>
          </form></> : <div className="success-state"><div className="success-icon"><Check/></div><span className="section-no">订 位 成 功</span><h2>位置给你留好啦！</h2><p>这是一条演示确认，未保存任何个人信息。<br/>到店时，记得带上好胃口。</p><button className="submit-btn" onClick={closeReservation}>好，饭点见</button></div>}
      </section>
    </div>}
  </div>
}

export default App
