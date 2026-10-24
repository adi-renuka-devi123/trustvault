import { useState, useEffect } from 'react';

const API = 'https://trustvault-0x9y.onrender.com';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchFiles = () => {
    fetch(`${API}/api/files`).then(r=>r.json()).then(setFiles);
  };
  
  useEffect(() => { if(user) fetchFiles(); }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? `${API}/api/auth/login` : `${API}/api/auth/register`;
    const body = isLogin ? {email, password} : {email, password, name};
    const res = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    const data = await res.json();
    if(data.token){ localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); fetchFiles(); }
    else setMsg(data.message);
  };

  const handleUpload = async () => {
    if(!file) return;
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch(`${API}/api/files/upload`, {method:'POST', body: fd});
    const data = await res.json();
    setMsg(data.message); fetchFiles();
  };

  const logout = () => { localStorage.removeItem('user'); setUser(null); }

  if(!user){
    return (
      <div style={{maxWidth:400, margin:'50px auto', padding:20, border:'1px solid #ddd', borderRadius:10}}>
        <h2>TrustVault - {isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuth}>
          {!isLogin && <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', padding:10, margin:'5px 0'}} />}
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:10, margin:'5px 0'}} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:10, margin:'5px 0'}} />
          <button type="submit" style={{width:'100%', padding:10, background:'black', color:'white', marginTop:10}}>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p onClick={()=>setIsLogin(!isLogin)} style={{cursor:'pointer', color:'blue', marginTop:10}}>{isLogin ? 'Need Register?' : 'Have Login?'}</p>
        <p style={{color:'red'}}>{msg}</p>
      </div>
    )
  }

  return (
    <div style={{maxWidth:600, margin:'30px auto', padding:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>TrustVault - Secure Vault</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <p>Welcome {user.name || user.email}!</p>
      
      <div style={{border:'1px solid #ddd', padding:20, borderRadius:10, marginTop:20}}>
        <h3>Upload File</h3>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button onClick={handleUpload} style={{marginLeft:10, padding:'5px 15px', background:'black', color:'white'}}>Upload</button>
        <p style={{color:'green'}}>{msg}</p>
      </div>

      <div style={{marginTop:30}}>
        <h3>Your Vault - {files.length} files</h3>
        {files.map(f => (
          <div key={f._id} style={{padding:10, border:'1px solid #eee', margin:'8px 0', borderRadius:8, display:'flex', justifyContent:'space-between'}}>
            <span>📁 {f.originalName}</span>
            <span>{(f.size/1024).toFixed(1)} KB | {new Date(f.uploadedAt).toLocaleString()}</span>
          </div>
        ))}
        {files.length===0 && <p>No files yet - Upload first!</p>}
      </div>
    </div>
  )
}

export default App;