import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import { GEO_OPTIONS, POS_KEY, TOKEN_KEY, AUTH_HEADER, API_ROOT } from '../constants';
import { GOOG_MAP_KEY } from '../googleApiKey';
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import { AroundMap } from './AroundMap';

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;

export class Home extends React.Component {
    state = {
        isLoadingGeolocation: false,
        error: '',
        isLoadingPosts: false,
        posts: [],
        topic: 'around'
    }
    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({
                isLoadingGeolocation: true
            });
            navigator.geolocation.getCurrentPosition(
                this.onSuccussLoadGeolocation,
                this.onFailLoadGeolocation,
                GEO_OPTIONS 
            );
        } else {
            this.setState({
                error: 'Geolocation is not supported.'
            });
        }
    }

    onSuccussLoadGeolocation = (position) => {
            console.log(position)
            const { latitude, longitude } = position.coords;
            //JSON.stringify() convert javascript object to string
            //local storage must use string type
            localStorage.setItem(POS_KEY, JSON.stringify({
                lat: latitude,
                lon: longitude
            }));
            this.setState({
                isLoadingGeolocation: false
            });
            //go get nearby posts after it gets location successfully
            this.loadNearbyPosts();
    }

    onFailLoadGeolocation = (err) => {
        this.setState({
            isLoadingGeolocation: false,
            error: 'Failed to get user location'
        });
    }

    loadNearbyPosts = (center, radius) => {
        this.setState({ 
            isLoadingPosts: true
        });
        //get position from localStorage  string -> jS object
        const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        //Fire API call with token
        const token = localStorage.getItem(TOKEN_KEY);
        fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                //transfer the response from string to json object
                return response.json();
            }
            throw new Error('Failed to load posts.');
        }).then((data) => {
            console.log(data);
            if (this.state.topic === "around") {
                this.setState({
                    isLoadingPosts: false,
                    posts: data ? data : []
                });
            }
        }).catch((e) => {
            this.setState({
                isLoadingPosts: false,
                error: e.message
            });
        })
    }

    getImagePosts = () => {
        const images = this.state.posts
            .filter(({type}) => type === 'image')
            .map(({user, url, message}) => ({
            user,
            src: url,
            thumbnail: url,
            caption: message,
            thumbnailWidth: 400,
            thumbnailHeight: 300
        }))
        return <Gallery images={images}/>; //render image posts
    }

    getVideoPosts = () => {
        const videos = this.state.posts 
            .filter(({type}) => type === 'video')
            .map(({user, url, message}) => {
                return (
                    <Col span={6} key={url}>
                        <video src={url} controls className="video-block"/>
                        <p key={url}> {`${user}: ${message}`} </p>
                    </Col>
                );
            });
        return (<Row gutter={32}>
            {videos}
        </Row>);
    }

    getPanelContent = (type) => {
        const { error, isLoadingGeolocation, isLoadingPosts, posts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeolocation){
            return <Spin tip="Loading geo location..."/>;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..."/>;
        } else if (posts && posts.length > 0){
            //if (images) -> getImagePosts()
            //else (video) -> ...
            return type === 'image' ? this.getImagePosts() : this.getVideoPosts();
        } else {
            return 'No nearby posts.';
        }
    }

    loadFacesAroundTheWorld = () => {
        //1. Fire API
        //2. Put result in state
        const token = localStorage.getItem(TOKEN_KEY);
        console.log('loadFacesAroundTheWorld');
        this.setState({ 
            isLoadingPosts: true
        });
        //Fire API call with token
        fetch(`${API_ROOT}/cluster?term=face`, {
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                //transfer the response from string to json object
                return response.json();
            }
            throw new Error('Failed to load posts.');
        }).then((data) => {
            console.log(data);
            if (this.state.topic === "face") {
                this.setState({
                    isLoadingPosts: false,
                    posts: data ? data : []
                });
            }
        }).catch((e) => {
            this.setState({
                isLoadingPosts: false,
                error: e.message
            });
        })

    }
    onTopicChange = (e) => {
        const topic = e.target.value;
        this.setState({
            topic: e.target.value
        });
        if (topic === 'face') {
            this.loadFacesAroundTheWorld();
        } else {
            this.loadNearbyPosts();
        }
    }

    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;

        return (
            <div>
                <RadioGroup className="topic-radio-group" onChange={this.onTopicChange} value={this.state.topic}>
                    <Radio value="around">Posts Around Me</Radio>
                    <Radio value="face">Faces Around the World</Radio>
                </RadioGroup>
                <Tabs className="main-tabs" tabBarExtraContent={operations}>
                    <TabPane tab="Image Posts" key="1">
                        {this.getPanelContent('image')}
                    </TabPane>
                    <TabPane tab="Video Posts" key="2">
                        {this.getPanelContent('video')}
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <AroundMap 
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOG_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            posts={this.state.posts}
                            loadNearbyPosts={this.state.topic === 'around' ? this.loadNearbyPosts : this.loadFacesAroundTheWorld}
                        />
                    </TabPane>
                </Tabs>
            </div>
   
        );
    }
}