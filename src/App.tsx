import React, { FC } from 'react';
import './App.less';

import { Image, Layout, Menu } from 'antd';

// see https://ant.design/components/icon/
import {
  UploadOutlined, UserOutlined,
  VideoCameraOutlined, AudioFilled,
  LinkOutlined, MedicineBoxTwoTone,
  CameraOutlined,
  BulbOutlined,
  ControlOutlined,
  ExperimentOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FileUnknownOutlined,
  HomeOutlined,
  IdcardOutlined,
  MessageOutlined,
  LoadingOutlined,
  NodeIndexOutlined,
  PartitionOutlined,
  PaperClipOutlined,
  RobotOutlined,
  SettingOutlined,
  SoundOutlined,
  StarOutlined,
  StarFilled,
  TagsOutlined,
  TranslationOutlined


} from '@ant-design/icons';




const { Header, Content, Footer, Sider } = Layout;




const App: FC = () => (
  <Layout>
    <Sider
      theme="light"
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="logo">
        <Image src="logo.png" ></Image>
      </div>

      <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          Home
        </Menu.Item>
        <Menu.Item key="2" icon={<CameraOutlined />}>
          Scan a picture
        </Menu.Item>
        <Menu.Item key="3" icon={<UploadOutlined />}>
          Upload a document
        </Menu.Item>
        <Menu.Item key="4" icon={<AudioFilled />}>
          Transcribe Audio
        </Menu.Item>
        <Menu.Item key="5" icon={<LinkOutlined />}>
          Analyse Web Article
        </Menu.Item>


      </Menu>
    </Sider>
    <Layout style={{ height: '100vh' }}>
      <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />

      <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360, height: "100%" }}>
          content
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>© 2021 by MedJargonBuster Team <a href="https://medjargonbuster.com">https://medjargonbuster.com</a></Footer>
    </Layout>
  </Layout>);


export default App;
