import { useEffect, useRef, useState } from 'react';
import { business, heroPromotion, services, steps } from './content';

function Arrow({ diagonal = false, className = '' }) {
  return <svg className={`arrow ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Check() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/><path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function BrandLogo() {
  // Show the supplied light variant without altering the original two-logo artwork.
  return <svg className="brand-logo" viewBox="1100 15 835 710" width="835" height="710" aria-hidden="true" focusable="false"><image href="/images/lrd-logo-original.png" width="2070" height="760"/></svg>;
}

function AccreditationStrip() {
  const badges = [
    { name: 'Gas Safe Register', x: 0, width: 186 },
    { name: 'NICEIC Approved Contractor', x: 200, width: 308 },
    { name: 'CHAS', x: 538, width: 292 },
    { name: 'British Institute of KBB Installation member', x: 858, width: 533 },
  ];
  return <section className="accreditations" aria-label="Company accreditations" tabIndex={0}>
    <div className="badge-window"><div className="badge-track">
      {[0, 1].map(group => <div className="badge-group" key={group} aria-hidden={group === 1 ? true : undefined}>{[0, 1].map(copy => badges.map(badge => <svg className="badge-mark" key={`${copy}-${badge.name}`} viewBox={`${badge.x} 0 ${badge.width} 187`} width={badge.width * 64 / 187} height="64" role="img" aria-label={badge.name} aria-hidden={copy === 1 ? true : undefined}><image href="/images/accreditations.png" width="1391" height="187"/></svg>))}</div>)}
    </div></div>
  </section>;
}

function EnquiryDialog({ dialogRef, service, open, onClose }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const formRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => { if (open) { setStatus('idle'); setError(''); setDraft(''); formRef.current?.reset(); } }, [service, open]);
  useEffect(() => () => requestRef.current?.abort(), [open, service]);

  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const message = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not supplied'}\nPostcode: ${data.postcode}\nService: ${data.service}\n\n${data.message}`;
    setDraft(`mailto:${business.email}?subject=${encodeURIComponent('Website enquiry: ' + data.service)}&body=${encodeURIComponent(message)}`);
    setStatus('sending'); setError('');
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch('/api/enquiry.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'We couldn’t send your enquiry. Please use email or call us.');
      setStatus('success');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setStatus('error');
      setError(err.name === 'TimeoutError' ? 'The connection timed out. You can send your enquiry by email below, or call us.' : (err.message?.startsWith('Unexpected') || err.message === 'Failed to fetch' ? 'We couldn’t connect. Please use email or call us.' : err.message));
    }
  }

  return <dialog ref={dialogRef} className="enquiry-dialog" aria-labelledby="enquiry-title" onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current.close(); }}>
    <div className="dialog-inner" data-lenis-prevent>
      <button type="button" className="close-button" aria-label="Close enquiry" onClick={() => dialogRef.current.close()}><span aria-hidden="true">×</span></button>
      <p className="eyebrow">A conversation is a good place to start</p>
      <h2 id="enquiry-title">Let’s talk about <em>your home.</em></h2>
      <p className="dialog-intro">Tell us a little about what you have in mind. For restoration support, call <a href={`tel:${business.telephone}`}>{business.phone}</a>.</p>
      {status === 'success' ? <div className="success-message" role="status"><Check/><h3>Your enquiry is on its way.</h3><p>Thank you for getting in touch. The team will respond using the contact details you provided.</p><button className="button primary" onClick={() => dialogRef.current.close()}>Back to the website <Arrow/></button></div> :
        <form ref={formRef} key={service} onSubmit={submit}>
          <label>I’d like help with<select name="service" defaultValue={service || 'Renovation'}><option>Renovation</option><option>Fire & flood restoration</option><option>Kitchens & bathrooms</option><option>Extensions & loft conversions</option><option>Something else</option></select></label>
          <div className="form-row"><label>Your name<input name="name" autoComplete="name" required maxLength={100}/></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label></div>
          <div className="form-row"><label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30}/></label><label>Property postcode<input name="postcode" autoComplete="postal-code" required maxLength={12}/></label></div>
          <label>A little about your project<textarea name="message" rows="3" required minLength={10} maxLength={3000}/></label>
          <div className="form-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
          <p className="form-note">We’ll use these details to respond to your enquiry. Please don’t include sensitive information.</p>
          <div role="alert" className={error ? 'form-error' : ''}>{error}{error && draft && <a href={draft}>Send this enquiry using your email app <Arrow/></a>}</div>
          <button className="button primary form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending your enquiry…' : 'Send your enquiry'}<Arrow/></button>
          <a className="direct-email" href={`mailto:${business.email}`}>Prefer to email us directly?</a>
        </form>}
    </div>
  </dialog>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const menuButton = useRef(null);

  function openEnquiry(value = 'Renovation', event) {
    event?.preventDefault();
    triggerRef.current = event?.currentTarget || document.activeElement;
    setService(value); setMenuOpen(false); setDialogOpen(true);
    dialogRef.current.showModal();
  }

  useEffect(() => {
    if (!dialogOpen) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new CustomEvent('enquiry:open'));
    return () => { document.body.style.overflow = prior; window.dispatchEvent(new CustomEvent('enquiry:close')); };
  }, [dialogOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    const close = () => setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', close); };
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#" aria-label="London Renovation Design, home"><BrandLogo/></a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#expertise">Our expertise</a><a href="#approach">Our approach</a><a href="#contact">Get in touch</a></nav>
        <a className="header-phone" href={`tel:${business.telephone}`}>{business.phone}<Arrow diagonal/></a>
        <button className="menu-toggle" ref={menuButton} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}><a href="#expertise" onClick={() => setMenuOpen(false)}>Our expertise <Arrow/></a><a href="#approach" onClick={() => setMenuOpen(false)}>Our approach <Arrow/></a><a href="#contact" onClick={() => setMenuOpen(false)}>Get in touch <Arrow/></a><a href={`tel:${business.telephone}`}>Call {business.phone}</a></nav>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <figure className="hero-image">
          <img src="/images/kitchen.webp" srcSet="/images/kitchen-small.webp 800w, /images/kitchen.webp 1536w" sizes="100vw" alt="Renovation concept with oak cabinetry, a stone island and garden-facing glazing" width="1536" height="1024" fetchPriority="high"/>
          <figcaption>Kitchen design concept</figcaption>
        </figure>
        <div className="hero-copy">
          <p className="hero-eyebrow">London Renovation Design</p>
          <h1 id="hero-title"><span className="hero-line">Restore. Renovate.</span><span className="hero-line">Reimagine.</span></h1>
          <p className="hero-description">Fire & flood restoration. Exceptional kitchens, bathrooms<br className="desktop-break"/> and home renovations. One team, across London.</p>
          <div className="hero-actions"><a className="button primary emergency-action" href={`tel:${business.telephone}`}><span>Contact us now<small>For emergency restoration</small></span><Arrow/></a><a className="button hero-secondary" href="#expertise">Discover our expertise <Arrow/></a></div>
        </div>
        <aside className="hero-promotion" aria-label="Featured renovation service"><div><p>{heroPromotion.label}</p><h2>{heroPromotion.title}</h2></div><a href={`mailto:${business.email}?subject=Kitchen%20and%20bathroom%20enquiry`} aria-haspopup="dialog" onClick={(e) => openEnquiry('Kitchens & bathrooms', e)}>{heroPromotion.action}<Arrow/></a></aside>
      </section>

      <AccreditationStrip/>

      <section className="expertise section-shell" id="expertise" aria-labelledby="expertise-title">
        <div className="section-heading" data-reveal><div><p className="eyebrow"><span className="red-square"/>What brings you here?</p><h2 id="expertise-title">Different beginnings.<br/><em>The same care.</em></h2></div><p className="section-description">Whether you’re finding your feet after the unexpected or ready to make a change, there’s a way forward.</p></div>
        <div className="service-grid">
          {services.map(item => <article className={`service-card ${item.id}`} key={item.id} data-reveal>
            <div className="service-photo"><img src={`/images/${item.image}.webp`} srcSet={`/images/${item.image}-small.webp 800w, /images/${item.image}.webp 1536w`} sizes="(max-width: 760px) 100vw, 46vw" width="1536" height="1024" loading="lazy" alt={item.alt}/><span className="service-number">/{item.number}</span><span className="concept-caption">Illustrative concept</span><div className="service-photo-title"><p>{item.label}</p><h3>{item.title}<br/><em>{item.emphasis}</em></h3></div></div>
            <div className="service-details"><p>{item.description}</p><ul>{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a className="service-action" href={`mailto:${business.email}?subject=${encodeURIComponent(item.title + ' enquiry')}`} aria-haspopup="dialog" onClick={(e) => openEnquiry(item.id === 'restoration' ? 'Fire & flood restoration' : 'Kitchens & bathrooms', e)}>{item.action}<span className="circle-arrow"><Arrow diagonal/></span></a></div>
          </article>)}
        </div>
        <div className="restoration-note"><span className="note-label"><span className="red-square"/>Need restoration support?</span><p>Speak to the team about the next step.</p><a href={`tel:${business.telephone}`}>Call {business.phone}<Arrow diagonal/></a></div>
      </section>

      <section className="approach section-shell" id="approach" aria-labelledby="approach-title">
        <div className="approach-heading" data-reveal><p className="eyebrow"><span className="red-square"/>The way we work</p><h2 id="approach-title">Your home is personal.<br/><em>So is our approach.</em></h2><p>There’s enough to think about when you’re changing your home. We bring the people, the planning and the practical work together, so you know who to turn to.</p><a className="text-link" href="#contact">Get to know your next step <Arrow diagonal/></a></div>
        <div className="steps">{steps.map(step => <div className="step" key={step.number} data-reveal><span className="step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></div>)}</div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner" data-reveal><div><p className="eyebrow">Every home starts with a conversation.</p><h2 id="contact-title">Let’s talk about<br/><em>what comes next.</em></h2><a className="button light" href={`mailto:${business.email}?subject=Website%20enquiry`} aria-haspopup="dialog" onClick={(e) => openEnquiry('Renovation', e)}>Start your conversation <Arrow diagonal/></a></div><div className="contact-options"><div><span>Give us a call</span><a className="contact-phone" href={`tel:${business.telephone}`}>{business.phone}<Arrow diagonal/></a></div><div><span>Send us a note</span><a className="contact-email" href={`mailto:${business.email}`}>{business.email}<Arrow diagonal/></a></div><p>Based in Harrow.<br/>Restoring and renovating homes across London.</p></div></div>
        <span className="contact-watermark" aria-hidden="true">Home.</span>
      </section>
    </main>

    <footer className="site-footer"><div className="footer-top"><a href="#" className="brand" aria-label="London Renovation Design, back to top"><BrandLogo/></a><p>Property development.<br/>Project management. Peace of mind.</p><address>15A Station Road<br/>Harrow, London HA1 2UF</address><a className="back-top" href="#">Back to top <span aria-hidden="true">↑</span></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} London Renovation Design Ltd</span><div><a href="https://www.londonrenovationdesign.co.uk/business-terms/">Business terms</a><a href="https://www.londonrenovationdesign.co.uk/terms-of-use/">Terms of use</a></div><span className="footer-signoff">Build a better tomorrow.</span></div></footer>
    <EnquiryDialog dialogRef={dialogRef} service={service} open={dialogOpen} onClose={() => { setDialogOpen(false); triggerRef.current?.focus(); }}/>
  </>;
}
