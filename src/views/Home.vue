<script setup>
import GalleryCard from '@/components/cards/GalleryCard.vue';
import ImageCard from '@/components/cards/ImageCard.vue';
import LinkCard from '@/components/cards/LinkCard.vue';
import Discord from '@/components/icons/Discord.vue';
import Gmail from '@/components/icons/Gmail.vue';
import LinkedIn from '@/components/icons/LinkedIn.vue';
import YouTube from '@/components/icons/YouTube.vue';
</script>

<template>
  <div id="who-am-i"
    class="w-full px-8 xl:px-32 bg-[url('/images/hero_bg.png')] bg-cover bg-center flex-col xl:flex-row justify-between items-center flex">
    <div class="w-full xl:w-1/2 py-8 xl:px-16 flex-col justify-center items-start gap-8 flex">
      <h2>Who am I?</h2>
      <p>My name is <b>AlacrisDevs</b> (or Alex). I am a versatile creator from Estonia. I specialize in graphic
        design, event planning and management, and game development.<br /><br />

        With a background in graphic design since <b>2019</b>, I've collaborated with over 30 clients, helping them
        shape distinctive brand identities. Alongside design, I'm deeply involved in game development, including my work
        on <b>Packet Tracers</b>, a multiplayer game I built during my studies.<br /><br />

        I'm the main organizer of <b>TalTech GameCamp</b> and <b>Gamedev Guild</b>, where I bring together developers
        and enthusiasts to share knowledge, network, and create! These events, hosted in collaboration with Estonian
        game developers and <b>TalTech Tallinn University of Technology</b>, have grown into key platforms for Estonia's
        game development community.
      </p>
    </div>
    <div
      class="w-full xl:w-1/2 pt-8 self-stretch flex-col xl:flex-row justify-center xl:justify-end items-center xl:items-end flex">
      <img class="w-3/4" src="../../public/images/hero.png" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-16 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Selection of graphic design commissions</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <ImageCard card-name="Tigo" card-description="Profile picture"
        image-src="/images/commissions/commission_tigo.png" />
      <ImageCard card-name="Katsky" card-description="Profile picture"
        image-src="/images/commissions/commission_katsky.png" />
      <ImageCard card-name="Enoki" card-description="Profile picture"
        image-src="/images/commissions/commission_enoki.png" />
      <ImageCard card-name="BobDotCom" card-description="Profile picture"
        image-src="/images/commissions/commission_bobdotcom.png" />
      <ImageCard card-name="Yikizi" card-description="Profile picture"
        image-src="/images/commissions/commission_yikizi.png" />
      <ImageCard card-name="Apex" card-description="Discord bot picture"
        image-src="/images/commissions/commission_apex.png" />
      <ImageCard card-name="inDuo" card-description="Discord server picture"
        image-src="/images/commissions/commission_induo.png" />
      <ImageCard card-name="Aegcon 2022" card-description="GameDev Estonia Summer Conference logo"
        image-src="/images/commissions/commission_aegcon.png" />
    </div>
  </div>
  <div id="projects"
    class="w-full px-8 xl:px-32 py-16 bg-darkest flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">My games and ongoing projects</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <LinkCard card-url="https://alacrisdevs.itch.io/packet-tracers" card-name="Packet Tracers"
        card-description="Defend your network from the impending viral invasion!"
        image-src="/images/games/game_packet_tracers.svg" />
      <LinkCard card-url="https://alacrisdevs.itch.io/lux-mundi" card-name="Lux Mundi"
        card-description="A visually soothing time-killer sandbox made in 4 days."
        image-src="/images/games/game_lux_mundi.svg" />
      <LinkCard card-url="https://alacrisdevs.itch.io/dichotomia" card-name="Dichotomia"
        card-description="Fight your inner demon, Jekyll. Fight it."
        image-src="/images/games/game_dichotomia.svg" />
      <LinkCard card-url="https://induo.dev/" card-name="At World's End"
        card-description="A race against time, where time itself is your greatest ally and enemy."
        image-src="/images/games/game_awe.svg" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-16 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Events I'm organizing</h2>
    <div class="grid grid-cols-2 gap-4 place-items-center">
      <LinkCard card-url="https://gamecamp.ituk.ee/" card-name="TalTech GameCamp"
        card-description="A combination of a game development bootcamp and a game jam."
        image-src="/images/events/event_gamecamp.png" />
      <ImageCard card-name="Gamedev Guild"
        card-description="A casual meetup for Estonian gamedevs to showcase projects in an informal setting."
        image-src="/images/events/event_gamedev_guild.png" />
    </div>
  </div>
  <div class="w-full px-8 xl:px-32 py-16 bg-darkest flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Organizations and brands I've worked with</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <LinkCard card-url="https://taltech.ee/en/school-of-information-technologies" card-name="TalTech School of IT"
        card-description="Commissioned designs like promotional material and stickers."
        image-src="/images/orgs/org_taltech_it.png" />
      <LinkCard card-url="https://gamedevestonia.ee/" card-name="GameDev Estonia"
        card-description="Designing event logos and organizing events."
        image-src="/images/orgs/org_gamedev_estonia.png" />
      <LinkCard card-url="https://emajatutarlilled.ee/" card-name="Lillegalerii Ema ja Tütar"
        card-description="Created and designed the brand." image-src="/images/orgs/org_lillesalong.png" />
      <LinkCard card-url="https://pycord.dev/" card-name="Pycord" card-description="Created and designed the brand."
        image-src="/images/orgs/org_pycord.png" />
      <LinkCard card-url="https://www.instagram.com/ofnurk/" card-name="ÕF Nurk"
        card-description="Created and designed the brand." image-src="/images/orgs/org_nurk.png" />
      <LinkCard card-url="https://www.instagram.com/kiut.gloss/" card-name="ÕF Mokamääre"
        card-description="Created and designed the brand." image-src="/images/orgs/org_mokamaare.png" />
    </div>
    <br />
    <h2 class="text-center">...and the list doesn't stop there!</h2>
  </div>
  <div id="gallery" class="w-full px-8 xl:px-32 py-16 bg-dark flex-col justify-center items-center gap-8 inline-flex">
    <h2 class="text-center">Memories</h2>
    <div class="grid grid-cols-2 xl:grid-cols-4 sm:grid-cols-4 gap-4 place-items-center">
      <GalleryCard image-src="/images/memories/first_yt.jpg" card-name="First YouTube video" />
      <GalleryCard image-src="/images/memories/team_greenjam.png" card-name="First Game Jam" />
      <GalleryCard image-src="/images/memories/first_song.png" card-name="First song" />
      <GalleryCard image-src="/images/memories/first_cover.jpg" card-name="First cover" />
      <GalleryCard image-src="/images/memories/firstmeetup_1.jpg" card-name="Early GameDev meetup" />
      <GalleryCard image-src="/images/memories/firstmeetup_2.jpg" card-name="Early GameDev meetup" />
      <GalleryCard image-src="/images/memories/firstmeetup_3.jpg" card-name="Early GameDev meetup" />
      <GalleryCard image-src="/images/memories/summerconf22_1.jpg" card-name="GameDev Summer Conference" />
      <GalleryCard image-src="/images/memories/summerconf22_2.jpg" card-name="GameDev Summer Conference" />
      <GalleryCard image-src="/images/memories/christmas_1.jpg" card-name="Christmas GameDev Meetup" />
      <GalleryCard image-src="/images/memories/christmas_2.jpg" card-name="Christmas GameDev Meetup" />
      <GalleryCard image-src="/images/memories/christmas_3.jpg" card-name="Christmas GameDev Meetup" />
      <GalleryCard image-src="/images/memories/mobidictum23.jpg" card-name="Mobidictum Tallinn 2023" />
      <GalleryCard image-src="/images/memories/mangudeoo23.jpg" card-name="MängudeÖÖ 2023" />
      <GalleryCard image-src="/images/memories/indieshowcase23.jpg" card-name="Indie Showcase 2023" />
      <GalleryCard image-src="/images/memories/AlacrisDevs.jpg" card-name="AlacrisDevs photoshoot" />
      <GalleryCard image-src="/images/memories/photoshoot1.JPG" card-name="AlacrisDevs photoshoot" />
      <GalleryCard image-src="/images/memories/photoshoot2.JPG" card-name="AlacrisDevs photoshoot" />
      <GalleryCard image-src="/images/memories/gamecamp24_1.jpg" card-name="TalTech GameCamp 2024" />
      <GalleryCard image-src="/images/memories/gamecamp24_2.jpg" card-name="TalTech GameCamp 2024" />
      <GalleryCard image-src="/images/memories/gamecamp24_3.jpg" card-name="TalTech GameCamp 2024" />
      <GalleryCard image-src="/images/memories/gamedevguild24_1.jpg" card-name="Gamedev Guild 2024" />
      <GalleryCard image-src="/images/memories/gamedevguild24_2.jpg" card-name="Gamedev Guild 2024" />
      <GalleryCard image-src="/images/memories/gamedevguild24_3.jpg" card-name="Gamedev Guild 2024" />
      <GalleryCard image-src="/images/memories/gamedevguild24_4.jpg" card-name="Gamedev Guild 2024" />
      <GalleryCard image-src="/images/memories/gamedevguild24_5.jpg" card-name="Gamedev Guild 2024" />
      <GalleryCard image-src="/images/memories/gamecamplite_1.jpg" card-name="TalTech GameCamp Lite" />
      <GalleryCard image-src="/images/memories/gamecamplite_2.jpg" card-name="TalTech GameCamp Lite" />
      <GalleryCard image-src="/images/memories/gamecamplite_3.jpg" card-name="TalTech GameCamp Lite" />
      <GalleryCard image-src="/images/memories/mangudeoo24_1.JPG" card-name="MängudeÖÖ 2024" />
      <GalleryCard image-src="/images/memories/mangudeoo24_2.JPG" card-name="MängudeÖÖ 2024" />
      <GalleryCard image-src="/images/memories/mangudeoo24_3.JPG" card-name="MängudeÖÖ 2024" />
    </div>
  </div>
  <div id="contact"
    class="w-full px-8 xl:px-32 py-16 bg-[url('/images/footer_bg.png')] bg-cover bg-center flex-col justify-between gap-4 items-center flex">
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
