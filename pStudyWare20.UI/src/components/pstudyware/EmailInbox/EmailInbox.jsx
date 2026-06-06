import React, { useEffect, useState } from 'react';
import './EmailInbox.css';
import emailService from '../../../services/emailService';
import {
  AccessTime,
  CheckBoxOutlineBlank,
  Create,
  DeleteOutline,
  Inbox,
  InsertDriveFile,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LabelImportantOutlined,
  MoreVert,
  Refresh,
  Report,
  Schedule,
  Search,
  Send,
  StarBorder,
  Tune,
} from '@mui/icons-material';

const LABELS = [
  { id: 'INBOX', name: 'Inbox', icon: Inbox },
  { id: 'STARRED', name: 'Starred', icon: StarBorder },
  { id: 'SNOOZED', name: 'Snoozed', icon: AccessTime },
  { id: 'SENT', name: 'Sent', icon: Send },
  { id: 'SCHEDULED', name: 'Scheduled', icon: Schedule },
  { id: 'DRAFT', name: 'Drafts', icon: InsertDriveFile },
  { id: 'IMPORTANT', name: 'Important', icon: LabelImportantOutlined, category: true },
  { id: 'SPAM', name: 'Spam', icon: Report, category: true },
  { id: 'TRASH', name: 'Bin', icon: DeleteOutline, category: true }
];

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

export default function EmailInbox() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [label, setLabel] = useState('INBOX');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readItem, setReadItem] = useState(null);
  const [listError, setListError] = useState('');
  const [bodyError, setBodyError] = useState('');
  const [view, setView] = useState('list'); // list | read | compose

  useEffect(() => {
    loadSuggestions();
    emailService.getAuthorizedEmails()
      .then(res => {
        if (res && res.success === false) {
          setErrorMessage(res.message || 'You are not authorized to access this inbox.');
          setAccounts([]);
          setSelectedAccount('');
        } else {
          const data = res && res.data ? res.data : res;
          setErrorMessage('');
          setAccounts(data || []);
          if (data && data.length) setSelectedAccount(data[0]);
        }
      })
      .catch((err) => { setErrorMessage(err && err.message ? err.message : 'Failed to load email access.'); });
  }, []);

  useEffect(() => {
    if (!errorMessage && selectedAccount) loadLabel(label);
  }, [selectedAccount]);

  function loadSuggestions() {
    emailService.getEmailSuggestions().then(res => {
      // not wired into datalist in this component for simplicity
    }).catch(() => {});
  }

  function loadLabel(newLabel) {
    setLabel(newLabel);
    setLoading(true);
    emailService.getEmailList(newLabel, selectedAccount, '')
      .then(res => {
        setListError('');
        if (res && res.success === false) {
          setListError(res.message || 'Failed to load messages');
          setItems([]);
        } else {
          const data = res && res.data ? res.data : res;
          setItems(data.Items || []);
        }
        setLoading(false);
        setView('list');
      })
      .catch((err) => { setListError(err && err.message ? err.message : 'Failed to load messages'); setLoading(false); });
  }

  function openEmail(id) {
    setLoading(true);
    emailService.getEmailBody(id, selectedAccount).then(res => {
      if (res && res.success === false) {
        setBodyError(res.message || 'Failed to load message');
        setReadItem(null);
      } else {
        const data = res && res.data ? res.data : res;
        setBodyError('');
        setReadItem(data);
      }
      setView('read');
      setLoading(false);
    }).catch((err) => { setBodyError(err && err.message ? err.message : 'Failed to load message'); setLoading(false); });
  }

  function showCompose(prefill) {
    setReadItem(prefill || null);
    setView('compose');
  }

  function handleReply(item) {
    const subjectPrefix = item.subject.toLowerCase().startsWith('re:') ? '' : 'Re: ';
    const replySubject = `${subjectPrefix}${item.subject}`;
    const originalDate = formatDate(item.date) || item.date;
    const replyBody = `\n\n\n----- Original Message -----\nFrom: ${item.from}\nSent: ${originalDate}\nTo: ${item.to || ''}\nSubject: ${item.subject}\n\n${item.body ? item.body.replace(/<[^>]*>/g, '') : ''}`;
    
    showCompose({
      from: item.from,
      subject: replySubject,
      body: replyBody,
      replyToEmailID: item.id || 0,
      mode: 'R'
    });
  }

  function handleForward(item) {
    const subjectPrefix = item.subject.toLowerCase().startsWith('fwd:') ? '' : 'Fwd: ';
    const forwardSubject = `${subjectPrefix}${item.subject}`;
    const originalDate = formatDate(item.date) || item.date;
    const forwardBody = `\n\n\n----- Forwarded Message -----\nFrom: ${item.from}\nSent: ${originalDate}\nTo: ${item.to || ''}\nSubject: ${item.subject}\n\n${item.body ? item.body.replace(/<[^>]*>/g, '') : ''}`;
    
    showCompose({
      from: '',
      subject: forwardSubject,
      body: forwardBody,
      replyToEmailID: 0,
      mode: 'N'
    });
  }

  function sendEmail(isDraft = false, form) {
    const payload = {
      to: form.to,
      cc: form.cc,
      bcc: form.bcc,
      subject: form.subject,
      body: form.body,
      isDraft: !!isDraft,
      scheduledTime: form.scheduledTime || '',
      targetEmail: selectedAccount,
      replyToEmailID: form.replyToEmailID || 0,
      mode: form.mode || 'N'
    };
    emailService.sendOrDraftEmail(payload).then(res => {
      const data = res && res.data ? res.data : res;
      alert((res && res.message) || 'Done');
      loadLabel(label);
      setView('list');
    }).catch(err => alert('Error: ' + (err && err.message)));
  }

  const primaryLabels = LABELS.filter(l => !l.category);
  const categoryLabels = LABELS.filter(l => l.category);
  const totalLabel = items.length ? `1-${items.length} of ${items.length}` : '0 items';

  return (
    <div className="gmail-container">
      <div className="sidebar">
        <button className="btn-compose" onClick={() => showCompose()}>
          <Create fontSize="small" /> Compose
        </button>
        <ul className="nav-labels">
          {primaryLabels.map(l => {
            const Icon = l.icon;
            return (
            <li key={l.id} className={l.id === label ? 'active' : ''} onClick={() => loadLabel(l.id)}>
              <Icon className="nav-icon" />{l.name}
            </li>
          )})}
        </ul>
        <div className="nav-category-title">Categories</div>
        <ul className="nav-labels">
          {categoryLabels.map(l => {
            const Icon = l.icon;
            return (
            <li key={l.id} className={l.id === label ? 'active' : ''} onClick={() => loadLabel(l.id)}>
              <Icon className="nav-icon" />{l.name}
            </li>
          )})}
        </ul>
      </div>

      <div className="email-main-content">
        <div className="top-bar">
          <select id="emailAccountSelector" className="account-selector" value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)}>
            {accounts.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <div className="search-box">
            <Search className="search-icon" />
            <input placeholder="Search mail" onKeyDown={e => { if(e.key === 'Enter') alert('Search not implemented'); }} />
            <Tune className="tune-icon" />
          </div>
        </div>
        {errorMessage ? (
          <div className="email-error-wrap">
            <div className="email-error">
              {errorMessage}
            </div>
          </div>
        ) : null}

        <div className="mail-workspace">
          <div className="mail-list-panel">
            <div className="action-bar">
              <div className="toolbar-left">
                <CheckBoxOutlineBlank className="toolbar-icon" />
                <Refresh className="toolbar-icon" titleAccess="Refresh" onClick={() => loadLabel(label)} />
                <MoreVert className="toolbar-icon" />
              </div>
              <div className="toolbar-right">
                <span>{totalLabel}</span>
                <KeyboardArrowLeft className="toolbar-icon disabled" />
                <KeyboardArrowRight className="toolbar-icon" />
              </div>
            </div>
            <div className="email-list-container">
              {loading && <div style={{textAlign:'center',padding:32,color:'#9aa0a6'}}>Loading...</div>}
              {!loading && listError && <div style={{textAlign:'center',padding:24,color:'#b00020'}}>{listError}</div>}
              {!loading && !listError && items.length===0 && <div style={{textAlign:'center',padding:32,color:'#9aa0a6'}}>No messages</div>}
              {!loading && !listError && items.map(it => (
                <div key={it.Id} className="email-list-item" onClick={() => openEmail(it.Id)}>
                  <div className="row-icons">
                    <CheckBoxOutlineBlank className="row-icon" />
                    <StarBorder className="row-icon" />
                  </div>
                  <div className="col-sender">From: {it.From}</div>
                  <div className="col-subject">{it.Subject}</div>
                  <div className="col-date">{formatDate(it.Date)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reading-panel">
            <div className="reading-pane" style={{display:view==='read'?'block':'none'}}>
              {bodyError ? (
                <div style={{padding:24,color:'#b00020'}}>{bodyError}</div>
              ) : readItem ? (
                <>
                  <div style={{display:'flex',gap:8,marginBottom:16}}>
                    <button className="btn-draft" onClick={() => setView('list')}>Back</button>
                    <button className="btn-send" onClick={() => handleReply(readItem)}>Reply</button>
                    <button className="btn-draft" onClick={() => handleForward(readItem)}>Forward</button>
                  </div>
                  <h2 style={{marginTop:0}}>{readItem.subject}</h2>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}>
                    <div>
                      <strong>{readItem.from}</strong><br/>
                      <small>{readItem.to}</small>
                    </div>
                    <div>{readItem.date}</div>
                  </div>
                  <div dangerouslySetInnerHTML={{__html: readItem.body}} />
                </>
              ) : <div style={{padding:24,color:'#9aa0a6'}}>Select a message to read</div>}
            </div>

            <div className="compose-pane" style={{display:view==='compose'?'block':'none'}}>
              {view === 'compose' && <ComposeForm onCancel={() => setView('list')} onSend={sendEmail} prefill={readItem} />}
            </div>

            <div style={{display:view==='list'?'none':'none'}} />
          </div>
        </div>
      </div>

      <div id="toast" className="toast-msg" />
    </div>
  );
}

function ComposeForm({ onCancel, onSend, prefill }) {
  const [to, setTo] = useState(prefill ? (prefill.mode === 'R' ? prefill.from : '') : '');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(prefill ? prefill.subject : '');
  const [body, setBody] = useState(prefill ? (prefill.body || '') : '');
  const [scheduledTime, setScheduledTime] = useState('');

  const replyToEmailID = prefill ? prefill.replyToEmailID : 0;
  const mode = prefill ? prefill.mode : 'N';

  return (
    <div style={{maxWidth:800,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h3 style={{margin:0}}>{mode === 'R' ? 'Reply Message' : 'Create New Message'}</h3>
        <div>
          <button className="btn-draft" onClick={() => onSend(true,{to,cc,bcc,subject,body,scheduledTime,replyToEmailID,mode})}>Save Draft</button>
        </div>
      </div>
      <input className="c-input" value={to} onChange={e=>setTo(e.target.value)} placeholder="To (Recipients)" />
      <input className="c-input" value={cc} onChange={e=>setCc(e.target.value)} placeholder="Cc" />
      <input className="c-input" value={bcc} onChange={e=>setBcc(e.target.value)} placeholder="Bcc" />
      <input className="c-input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" />
      <textarea className="c-textarea" value={body} onChange={e=>setBody(e.target.value)} placeholder="Start typing your message here..." />
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button className="btn-send" onClick={() => onSend(false,{to,cc,bcc,subject,body,scheduledTime,replyToEmailID,mode})}>Send</button>
        <input type="datetime-local" value={scheduledTime} onChange={e=>setScheduledTime(e.target.value)} style={{marginLeft:8}} />
        <button className="btn-draft" onClick={onCancel} style={{marginLeft:'auto'}}>Cancel</button>
      </div>
    </div>
  );
}
