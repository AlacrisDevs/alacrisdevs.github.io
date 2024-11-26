<script setup lang="ts">
import { ref } from 'vue';
import { gameList, eventList, designList, brandList, galleryList } from '@/components/lists/Data';
import GalleryCard from '@/components/cards/GalleryCard.vue';
import GalleryOverlay from '@/components/cards/GalleryOverlay.vue';
import ImageCard from '@/components/cards/ImageCard.vue';
import LinkCard from '@/components/cards/LinkCard.vue';
import Discord from '@/components/icons/Discord.vue';
import Gmail from '@/components/icons/Gmail.vue';
import LinkedIn from '@/components/icons/LinkedIn.vue';
import YouTube from '@/components/icons/YouTube.vue';

const galleries = {
    mainGallery: galleryList,
};

const galleryStates = ref<Record<string, { isOpen: boolean; currentIndex: number }>>(
  Object.keys(galleries).reduce((acc, key) => {
    acc[key] = { isOpen: false, currentIndex: 0 };
    return acc;
  }, {} as Record<string, { isOpen: boolean; currentIndex: number }>)
);

const setupScrollLock = (lock: boolean) => {
  document.body.style.overflow = lock ? 'hidden' : '';
};

const openOverlay = (galleryKey: string, index: number) => {
  galleryStates.value[galleryKey].isOpen = true;
  galleryStates.value[galleryKey].currentIndex = index;
  setupScrollLock(true);
};

const closeOverlay = (galleryKey: string) => {
  galleryStates.value[galleryKey].isOpen = false;
  setupScrollLock(false);
};

const updateIndex = (galleryKey: string, index: number) => {
  galleryStates.value[galleryKey].currentIndex = index;
};

</script>

<template>
  <div id="who-am-i"
    class="w-full px-8 xl:px-32 pt-24 bg-darkest bg-[url('/images/hero_bg.png')] bg-cover bg-center flex-col xl:flex-row justify-between items-center flex">
    <div class="w-full xl:w-1/2 pb-24 xl:px-16 flex-col justify-center items-start gap-8 flex">
      <h2>Who am I?</h2>
      <p>My name is <b>AlacrisDevs</b> (or Alex). I am a versatile creator from Estonia. I specialize in graphic
        design, event planning and management, and game development.<br /><br />

        With a background in graphic design since 2019, I've collaborated with over <b>30 clients</b>, helping them
        shape distinctive brand identities.<br />
        Alongside design, I'm deeply involved in game development, including my work on <b>Packet Tracers</b>, a
        multiplayer game I built during my studies.<br /><br />

        I'm the main organizer of <b>TalTech GameCamp</b> and <b>Gamedev Guild</b>, where I bring together developers
        and enthusiasts to share knowledge, network, and create!<br />
        These events, hosted in collaboration with Estonian game developers and <b>TalTech Tallinn University of
          Technology</b>, have grown into key platforms for Estonia's game development community.
      </p>
    </div>
    <div
      class="w-full xl:w-1/2 self-stretch flex-col xl:flex-row justify-center xl:justify-end items-center xl:items-end flex">
      <img class="w-3/4" src="../../public/images/hero.png" />
    </div>
  </div>
  <div id="projects" class="w-full px-8 xl:px-32 py-24 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">My games and ongoing projects</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <LinkCard v-for="(card, index) in gameList" :key="index" :card-url="card.url" :image-src="card.src"
        :card-name="card.name" :card-description="card.description" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-24 bg-darkest flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Events I'm organizing</h2>
    <div class="grid grid-cols-2 gap-4 place-items-center">
      <LinkCard v-for="(card, index) in eventList" :key="index" :card-url="card.url" :image-src="card.src"
        :card-name="card.name" :card-description="card.description" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-24 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Selection of graphic design commissions</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <ImageCard v-for="(card, index) in designList" :key="index" :image-src="card.src" :card-name="card.name"
        :card-description="card.description" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-24 bg-darkest flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Organizations and brands I've worked with</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <LinkCard v-for="(card, index) in brandList" :key="index" :card-url="card.url" :image-src="card.src"
        :card-name="card.name" :card-description="card.description" />
    </div>
    <br />
    <h2 class="text-center">...and the list doesn't stop there!</h2>
  </div>
  <div id="gallery" class="w-full px-8 xl:px-32 py-24 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Memories</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <GalleryCard v-for="(image, index) in galleries.mainGallery" :key="`mainGallery-${index}`"
                :index="index" :image-src="image.src" :card-name="image.name"
                @open-overlay="() => openOverlay('mainGallery', index)" />
    </div>
    <GalleryOverlay v-if="galleryStates['mainGallery'].isOpen" :photos="galleries.mainGallery"
            :currentIndex="galleryStates['mainGallery'].currentIndex"
            :isOpen="galleryStates['mainGallery'].isOpen"
            @close-overlay="() => closeOverlay('mainGallery')"
            @update-index="(index) => updateIndex('mainGallery', index)" />
  </div>
  <div id="contact"
    class="w-full px-8 xl:px-32 py-24 bg-[url('/images/footer_bg.png')] bg-cover bg-center flex-col justify-between gap-4 items-center flex">
    <h2>Get in touch</h2>
    <p class="flex-row gap-2 items-center flex">
      <Gmail /><a href="mailto:alacris@induo.dev">alacris@induo.dev</a>
    </p>
    <p class="flex-row gap-2 items-center flex">
      <LinkedIn /><a href="https://www.linkedin.com/in/alacrisdevs/" rel="noopener noreferrer">@alacrisdevs</a>
    </p>
    <p class="flex-row gap-2 items-center flex">
      <Discord /><a href="https://discord.com/invite/8JcX2NFJnq" rel="noopener noreferrer">@alacrisdevs</a>
    </p>
    <p class="flex-row gap-2 items-center flex">
      <YouTube /><a href="https://www.youtube.com/@alacrisdevs" rel="noopener noreferrer">@alacrisdevs</a>
    </p>
  </div>
</template>