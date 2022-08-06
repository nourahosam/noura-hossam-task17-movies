var eventsMediator = class {
    events = {};
    on(eventName, callbackFn) {
        this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
        this.events[eventName].push(callbackFn);
        //console.log(this.events)
    }
    emit(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (callbackFn) {
                callbackFn(data);
            })
        }
        //console.log(this.events)
    }
}

const mediator = new eventsMediator();

class MoviesAPI {
    movieList = {};
    constructor() {
        this.movieList = {};
    }

    init() {
        this.cacheElements();
        this.render();
    }

    cacheElements() {
        this.$card = $('<div></div>').addClass('col card');
        this.$img = $('.img img');
        this.$content = $('.content');
        this.$movies = $('.movies');
        this.$emptyMovies = $('.movies').clone();
        this.$container = $('.container');
    }
    bindEvents() {

    }

    async loadMovies() {
        var newList = {};
        var getSession = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=82e76194c0eb671daf705bb300744835&page=5')
                                    .catch(error => { console.log(error); alert("couldnt load message"); })
                                    .then(response => {
                                        this.movieList = response.data;
                                        //console.log(response);
                                        mediator.emit('moviesAPI.success', response.data)
                                    });
        //this.movieList = getSession.data;


    }
    async render() {
        
        await this.loadMovies();
        console.log(this.movieList);
        var counter = -1;
        this.movieList.results.forEach((el) => {
            counter++;
            this.$newCard = this.$card.clone();
            var htmlData = {
                poster: 'https://image.tmdb.org/t/p/original' + el.poster_path,
                title: el.title,
                rating: el.vote_average
            }
            this.$newContent = Mustache.render('<div class="img"><img src="{{ poster }}" onerror=this.src="./img/notfound.png"></div><div class="content"><span class="title"><h2>{{ title }}</h2></span><span class="rating"><p>{{rating}}</p></span>', htmlData);
            this.$newCard.html(this.$newContent);
            if (counter % 4 == 0) {
                this.$movies = this.$emptyMovies.clone();
                this.$newCard.appendTo(this.$movies);
                this.$movies.appendTo(this.$container);
            }
            else {
                this.$newCard.appendTo(this.$movies);
            }
        })
    }
}

var Stats = class{
    init(){
        this.cacheElements();
       // this.render();
        this.bindEvents();
    }
    cacheElements(){
        this.$statPage = $('.stat-page');
        this.$statMovies = $('.stat-movies');
        this.$statTop = $('.stat-top');
        this.$statRating = $('stat-rating');
    }
    showData(){

    }
    bindEvents(){
        mediator.on('moviesAPI.success', this.render.bind(this));
    }
    render(data){
        var top = {};
        var max=-1;
        data.results.forEach(el=>{
            if(el.vote_average > max){
                max = el.vote_average;
                top = el;
            }
        })
        console.log('topppppppppppp');
        console.log(top);
        console.log('topppppppppppp');
        this.$statPage.html(`Page: ${data.page}`);
        this.$statMovies.html(`Number of Movies: ${data.results.length}`);
        this.$statTop.html(`Top Rated Movie: ${top.title}`);
        this.$statRating.html(`Rating: ${top.vote_average}`)
    }
}



const movie = new MoviesAPI();
const stat = new Stats();
stat.init();
movie.init();
