// import logo from '../logo.svg';

import React from 'react';
import ProfileCard from '../components/ProfileCard';
import Particles from 'react-tsparticles';

import { loadBasic } from 'tsparticles-basic';

import { options } from '../config/particlesConfig';
import { Engine } from 'tsparticles-engine';

async function loadStarsPreset(engine: Engine, refresh = true): Promise<void> {
  await loadBasic(engine, false);

  await engine.addPreset('stars', options as any, refresh);
}
function Home() {
  return (
    <>
      <Particles init={loadStarsPreset} id="tsparticles" options={options as any} />
      <ProfileCard />;
    </>
  );
}

export default Home;
