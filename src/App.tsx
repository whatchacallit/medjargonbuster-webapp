import React, { FC, useState } from 'react';
import './App.less';

import { Layout, Menu, Image, Avatar, Space, Steps } from 'antd';


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
import Analyze from './analyze/Analyze';
import HomePage from './home/Home';

import Title from 'antd/lib/typography/Title';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


const { Header, Content, Footer, Sider } = Layout;




const App: FC = () => (
  <Layout style={{ height: '100%' }}>

    <Layout style={{ height: '100%' }}>

      <Content style={{ padding: '0 0 0', height: '100vh' }}>
        <div className="site-layout-background" style={{ padding: 30, minHeight: 0, height: "100%" }}>
          <Router>


            <Switch>


              {/* Route: Document Analysis*/}
              <Route path="/analyze">
                <Analyze />
              </Route>

              {/* Route: Home*/}
              <Route exact path="/">
                <HomePage />
              </Route>


            </Switch>
          </Router>

        </div>
      </Content>

      {/*       <Footer style={{ textAlign: 'center' }}>© 2021 by MedJargonBuster Team <a href="https://medjargonbuster.com">https://medjargonbuster.com</a></Footer>
 */}
    </Layout>
  </Layout >);


export default App;
