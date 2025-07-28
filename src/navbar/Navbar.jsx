import React, { useState } from 'react';
// import { CirclePicker, SketchPicker, TwitterPicker } from 'react-color';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    // const [selectedColor, setSelectedColor] = useState('#ff0000'); // Default color is red
    const [showPicker, setShowPicker] = useState(false); // Control picker visibility



    const linkStyle = (path) => {
        return location.pathname === path
            ? 'text-white dark:text-white bg-gray-500'
            : 'text-gray-900 dark:text-black';
    };

    const logout = () => {
        sessionStorage.removeItem("data")
        window.location.reload()
    }





    return (

        <>


            <nav className="fixed top-0 z-50 w-full bg-white  border-b border-gray-200 ">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <a className="flex ms-2 md:me-24">
                                {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" /> */}
                                <span className={`self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-black`}>DHARM GEMS</span>
                            </a>


                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">

                                <button className='h-5 w-5 mr-2 rounded-lg'
                                    style={{
                                        backgroundColor: '-moz-initial',

                                    }}
                                    onClick={() => setShowPicker(!showPicker)}
                                >
                                    {/* Select Color */}
                                </button>
                                <p className='text-sm font-sans font-medium'>Select Color</p>


                                {/* Conditionally render the picker */}
                                {/* {showPicker && (
                                    <div style={{ position: "absolute", zIndex: 2, marginTop: "225px" }}>
                                        <TwitterPicker style={{ width: '260px' }} className='w-36 !important' triangle='top-left' top-right
                                            colors={["#FF6900", "#FCB900", "#7BDCB5", "#00D084", "#1d4ed8", "#a21caf", "#1f618d", "#EB144C", "#ff0000", "#65a30d", "#9900EF", "#0a0a0a"]}
                                            onChangeComplete={(color) => setSelectedColor(color.hex)} // Update the color
                                        />
                                    </div>
                                )} */}

                                <div className="flex items-center ms-3">
                                    <p className='mr-2 font-semibold cursor-pointer' onClick={logout}>Logout</p>
                                    <i className="pi pi-sign-in cursor-pointer font-semibold" onClick={logout}></i>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-white dark:border-gray-300" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-white">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to={'/'} className={`flex items-center  ${linkStyle('/')} p-2 text-gray-900 rounded-lg   hover:bg-gray-400 hover:text-white group`} style={{
                                backgroundColor: location.pathname === '/' ? '-moz-initial' : 'transparent',
                                color: location.pathname === '/' ? '#fff' : '#000'

                            }}
                            >

                                <span className="ms-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <details>
                                <summary className="flex items-center w-full p-2 text-base  transition duration-75 rounded-lg group  text-black hover:bg-gray-500 hover:text-white cursor-pointer">
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">income</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                                    </svg>
                                </summary>
                                <ul className="py-2 space-y-2">
                                    <li>
                                        <Link to={'/addEntryincome'} href="#" className={`flex items-center  ${linkStyle('/addEntryincome')} w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/addEntryincome' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/addEntryincome' ? '#fff' : '#000'
                                            }}
                                        >Add Entry</Link>
                                    </li>
                                    <li>
                                        <Link to={'/showEntryincome'} href="#" className={`flex  ${linkStyle('/showEntryincome')} items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/showEntryincome' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/showEntryincome' ? '#fff' : '#000'
                                            }}>Show Entry</Link>
                                    </li>

                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  hover:bg-gray-500 hover:text-white cursor-pointer">
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Outgoing</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                                    </svg>
                                </summary>
                                <ul className="py-2 space-y-2">
                                    <li>
                                        <Link to={'/addEntryoutgoing'} href="#" className={`flex items-center  ${linkStyle('/addEntryoutgoing')} w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/addEntryoutgoing' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/addEntryoutgoing' ? '#fff' : '#000'
                                            }}>Add Entry</Link>
                                    </li>
                                    <li>
                                        <Link to={'/showEntryoutgoing'} href="#" className={`flex  ${linkStyle('/showEntryoutgoing')} items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/showEntryoutgoing' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/showEntryoutgoing' ? '#fff' : '#000'
                                            }}>Show Entry</Link>
                                    </li>

                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group  hover:bg-gray-500 hover:text-white cursor-pointer">
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Broker</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                                    </svg>
                                </summary>
                                <ul className="py-2 space-y-2">
                                    <li>
                                        <Link to={'/addbroker'} href="#" className={`flex ${linkStyle('/addbroker')} items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/addbroker' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/addbroker' ? '#fff' : '#000'
                                            }}>Add Broker</Link>
                                    </li>
                                    <li>
                                        <Link to={'/getbroker'} href="#" className={`flex ${linkStyle('/getbroker')}  items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group  hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/getbroker' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/getbroker' ? '#fff' : '#000'
                                            }}>Get Broker</Link>
                                    </li>

                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-500 hover:text-white cursor-pointer">
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Expanse</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                                    </svg>
                                </summary>
                                <ul className="py-2 space-y-2">
                                    <li>
                                        <Link to={'/addexpanse'} href="#" className={`flex ${linkStyle('/addexpanse')}  items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/addexpanse' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/addexpanse' ? '#fff' : '#000'
                                            }}>Add Expanse</Link>
                                    </li>
                                    <li>
                                        <Link to={'/getexpanse'} href="#" className={`flex ${linkStyle('/getexpanse')} items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-500 hover:text-white`}
                                            style={{
                                                backgroundColor: location.pathname === '/getexpanse' ? '-moz-initial' : 'transparent',
                                                color: location.pathname === '/getexpanse' ? '#fff' : '#000'
                                            }}>Get Expanse</Link>
                                    </li>

                                </ul>
                            </details>
                        </li>
                    </ul>
                </div>
            </aside>



        </>
    );
};

export default Navbar;
