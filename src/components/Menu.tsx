import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Button} from "antd";

export const AppMenu = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return <Breadcrumb items={[{
    title: <Button size={'small'} type={pathname.includes('send') ? 'link' : 'text'} onClick={() => navigate('/')}>Account</Button>
  }, {
    title: <Button size={'small'} type={!pathname.includes('send') ? 'link' : 'text'} onClick={() => navigate('/send')}>Send ONE</Button>
  }]} />;
}
