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
    }

    // breakpoints: {
    //   1024: {
    //     perView: 2
    //   },
    //   600: {
    //     perView: 1
    //   }
    // }
  }).mount() // .mount - load it
})