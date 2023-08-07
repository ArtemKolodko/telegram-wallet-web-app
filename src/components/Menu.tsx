import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Button} from "antd";

export const AppMenu = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const send = {
    title: <Button size={'small'} type={!pathname.includes('send') ? 'link' : 'text'} onClick={() => navigate('/send')}>Send ONE</Button>
  }

  const oneCountry = {
    title: <Button size={'small'} type={!pathname.includes('1country') ? 'link' : 'text'} onClick={() => navigate('/1country')}>Register domain</Button>
  }

  const items = [
    {
      title: <Button size={'small'} type={pathname !== '/' ? 'link' : 'text'} onClick={() => navigate('/')}>Account</Button>
    },
  ]

  if(pathname.includes('1country')) {
    items.push(oneCountry)
  } else {
    items.push(send)
  }

  return <Breadcrumb items={items} />;
}
