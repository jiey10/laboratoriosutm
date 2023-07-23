import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout({ children }) {
    return (
        <>
            <Sidebar>
                <Header />
                <div style={{ margin: '20px' }}>
                    {children}
                </div>
            </Sidebar>
        </>

    )
}

export default Layout