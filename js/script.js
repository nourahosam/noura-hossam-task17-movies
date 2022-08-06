class MoviesAPI {
    movieList = {};
    constructor(){
        this.movieList = {};
    }

    init() {
        this.cacheElements();
        this.render();
    }

    cacheElements(){
        this.$card = $('<div></div>').addClass('col card');
        this.$img = $('.img img');
        this.$content = $('.content');
        this.$movies = $('.movies');
        this.$emptyMovies = $('.movies').clone();
        this.$container = $('.container');
    }
    bindEvents(){

    }
    async loadMovies(){
        var newList = {};
        try{
        var getSession = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=82e76194c0eb671daf705bb300744835&page=5');
        this.movieList = getSession.data;
        console.log('1. load movies');
        console.log(this.movieList)
    }catch(e){
        console.log(e);
        console.log('couldnt load message');
    }
    }
    async render(){
        await this.loadMovies();
        var counter = -1;
        this.movieList.results.forEach((el)=>{
            
            counter++;
            this.$newCard = this.$card.clone();
            var htmlData = {
                poster: 'https://image.tmdb.org/t/p/original'+el.poster_path,
                title: el.title,
                rating: el.vote_average
            }
            this.$newContent = Mustache.render('<div class="img"><img src="{{ poster }}" onerror=this.src="./img/notfound.png"></div><div class="content"><span class="title"><h2>{{ title }}</h2></span><span class="rating"><p>{{rating}}</p></span>', htmlData);
            this.$newCard.html(this.$newContent);
            if(counter % 4 == 0){
                this.$movies = this.$emptyMovies.clone();
                this.$newCard.appendTo(this.$movies);
                this.$movies.appendTo(this.$container);
            }
            else{
                this.$newCard.appendTo(this.$movies);
            }
            

        })
        // 
    }
}

var eventsMediator = class {
    on(eventName, callbackFn){
        this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
        this.events[eventName].push(callbackFn);
    }
    emit(eventName, data){
        if(this.events[eventName]){
            this.events[eventName].forEach(function(callbackFn){
                callbackFn(data);
            })
        }
    }
}

 const movie = new MoviesAPI();
 movie.init();
