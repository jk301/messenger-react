

function Home({ logged }) {

  return (
    <div className="post-container">
        {!logged && <h1>Not logged in </h1>}
        {logged && <h1>Logged in (locked in)</h1>}
    </div>
  )
}

export default Home