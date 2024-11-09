<script setup>
import ImageCard from '@/components/cards/ImageCard.vue';
import LinkCard from '@/components/cards/LinkCard.vue';
</script>

<template>
  <div id="who-am-i"
    class="w-full px-8 xl:px-16 bg-hero-background bg-cover bg-center flex-col xl:flex-row justify-between items-center flex">
    <div class="w-full xl:w-1/2 py-8 xl:px-16 flex-col justify-center items-start gap-8 flex">
      <h1>Who am I?</h1>
      <p>My name is <b>AlacrisDevs</b> (or Alex). I am a versatile creator from Estonia. I specialize in graphic
        design, event planning and management, and game development.<br /><br />

        With a background in graphic design since <b>2019</b>, I’ve collaborated with over 30 clients, helping them
        shape distinctive brand identities. Alongside design, I’m deeply involved in game development, including my work
        on <b>Packet Tracers</b>, a multiplayer game I built during my studies.<br /><br />

        I’m the main organizer of <b>TalTech GameCamp</b> and <b>Gamedev Guild</b>, where I bring together developers
        and enthusiasts to share knowledge, network, and create! These events, hosted in collaboration with Estonian
        game developers and <b>TalTech Tallinn University of Technology</b>, have grown into key platforms for Estonia’s
        game development community.
      </p>
    </div>
    <div
      class="w-full xl:w-1/2 pt-8 self-stretch flex-col xl:flex-row justify-center xl:justify-end items-center xl:items-end flex">
      <img class="w-3/4" src="@/assets/images/hero_3.png" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-16 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Graphic design commissions</h2>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 place-items-center">
      <ImageCard card-name="Tigo" card-description="Profile picture"
        image-src="src/assets/images/commissions/commission_tigo.png" />
      <ImageCard card-name="Katsky" card-description="Profile picture"
        image-src="src/assets/images/commissions/commission_katsky.png" />
      <ImageCard card-name="Enoki" card-description="Profile picture"
        image-src="src/assets/images/commissions/commission_enoki.png" />
      <ImageCard card-name="Aegcon 2022"
        card-description="GameDev Estonia Summer Conference logo"
        image-src="src/assets/images/commissions/commission_aegcon.png" />
    </div>
  </div>
  <div id="projects" class="w-full px-8 xl:px-32 py-16 bg-black flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">My games and ongoing projects</h2>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 place-items-center">
      <LinkCard card-url="https://alacrisdevs.itch.io/packet-tracers" card-name="Packet Tracers"
        card-description="Defend your network from the impending viral invasion!"
        image-src="src/assets/images/games/game_packet_tracers.svg" />
      <LinkCard card-url="https://alacrisdevs.itch.io/lux-mundi" card-name="Lux Mundi"
        card-description="A visually soothing time-killer sandbox made in 4 days."
        image-src="src/assets/images/games/game_lux_mundi.svg" />
      <LinkCard card-url="https://alacrisdevs.itch.io/dichotomia" card-name="Dichotomia [GGJ Latvia 2022]"
        card-description="Fight your inner demon, Jekyll. Fight it."
        image-src="src/assets/images/games/game_dichotomia.svg" />
      <LinkCard card-url="https://induo.dev/" card-name="At World’s End"
        card-description="A race against time, where time itself is your greatest ally and enemy."
        image-src="src/assets/images/games/game_awe.svg" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-16 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Events I'm organizing</h2>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 place-items-center">
      <LinkCard card-url="https://gamecamp.ituk.ee/" card-name="TalTech GameCamp"
        card-description="A combination of a game development bootcamp and a game jam."
        image-src="src/assets/images/events/event_gamecamp.png" />
      <ImageCard card-name="Gamedev Guild"
        card-description="A casual meetup for Estonian gamedevs to showcase projects in an informal setting."
        image-src="src/assets/images/events/event_gamedev_guild.png" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-16 bg-black flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Organizations and brands I've worked with</h2>
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 place-items-center">
      <LinkCard card-url="https://taltech.ee/en/school-of-information-technologies" card-name="TalTech School of IT"
        card-description="Commissioned designs like promotional material and stickers."
        image-src="src/assets/images/orgs/org_taltech_it.png" />
      <LinkCard card-url="https://gamedevestonia.ee/" card-name="GameDev Estonia"
        card-description="Designing event logos and organizing events."
        image-src="src/assets/images/orgs/org_gamedev_estonia.png" />
      <LinkCard card-url="https://emajatutarlilled.ee/" card-name="Lillegalerii Ema ja Tütar"
        card-description="Created and designed the brand."
        image-src="src/assets/images/orgs/org_lillesalong.png" />
    </div>
    <h2 class="text-center">...and the list doesn't stop there!</h2>
  </div>
</template>
