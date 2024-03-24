import React from 'react'
// import Navbar from '../../components/Navbar'
const page = () => {
  return (
    <>
      <div className='gridWrapper |'>
        <div className='leftWrapper |'>
          <nav className="sideBar">
            <div>
              <div>
                <img src="sidebarMobileLogo.png" alt="" />
                <img src="bigblack.png" alt="" className='hidden |'/>
                <img src="sidebarOpenCloseButton" alt="" />
              </div>

              <div>
                <img src="sidebarHome.png" alt="" />
                <p className='hidden'>Home</p>
              </div>
              <div>

                <img src="sidebarCalendar.png" alt="" />
                <p className='hidden'>Calendar</p>
              </div>
            </div>

            <div>
              <img src="sidebarPremium.png" alt="" />
              <p className='hidden'>Premium</p>
            </div>
          </nav>
        </div>

        <div className='rightWrapper |'>
          <header>
            <h1>Hello 👋, Admin</h1>
            <div>
              <button>Upgrade</button>
              <div className="ignoreThisDiv line |"></div>
              <div>R</div>
            </div>
            <div className='hidden |'>R</div>
          </header>

          <div>
            <nav>
              <a href="">Classrooms</a>
              <a href="">Teachers</a>
              <a href="">Students</a>
            </nav>
            <button>+ Create</button>
          </div>

          <main>*cards here*</main>
        </div>

        <div className="createIconMobile | text-4xl w-[70px] aspect-square bg-white rounded-[50%] shadow-[0_0.25rem_1.75rem_hsl(0,0%,30%,25%)] grid place-items-center">+</div>
      </div>
    </>
  )
}

export default page
