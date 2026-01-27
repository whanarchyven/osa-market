"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body style={{background:'#101010',color:'white'}}>
        <main style={{fontFamily:"Montserrat",display:'flex',height:'100vh',width:'100vw',flexDirection:'column',gap:'24px',justifyContent:'center',alignItems:'center'}}>
          <h1 style={{fontSize:'36px'}}>500 - Внутренняя ошибка сервера</h1>
          <img style={{width:'400px'}} src={'/500.png'}/>
          <p>В серверной сейчас кого-то оттарабанят, и всё заработает</p>
          <p style={{opacity:0.5}}>немного подождите :)</p>
          
        </main>
      </body>
    </html>
  );
}
