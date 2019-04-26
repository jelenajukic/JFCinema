window.addEventListener('load', function () {
  new Glide('.glide', {
    // options
    startAt: 0,
    perView: 5,
    type: 'carousel',
    autoplay: 2000,  //ms 
    peek : {
      before: 0,
      after: 50
    },
    breakpoints: {
      // 1024: {
      //   perView: 2
      // },
      400: {
        perView: 1,
        peek : {
          before: 0,
          after: 100
        },
      },
      480: {
        perView: 2
      },
      800: {
        perView: 3
      },
      1000: {
        perView: 4
      }
    }
  }).mount() // .mount - load it
})