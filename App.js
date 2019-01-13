import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, StatusBar, RefreshControl } from 'react-native';
import { api_key, per_page, size_photo } from './config'
import Axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      page: 0,
      isLoading: true,
      hasMore: true
    }
  }

  loadImages(page) {
    this.setState({
      isLoading: true
    }, () => {
      let url = `https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=${api_key}&extras=description%2C+license%2C+date_upload%2C+date_taken%2C+owner_name%2C+icon_server%2C+original_format%2C+last_update%2C+geo%2C+tags%2C+machine_tags%2C+o_dims%2C+views%2C+media%2C+path_alias%2C+url_sq%2C+url_t%2C+url_s%2C+url_q%2C+url_m%2C+url_n%2C+url_z%2C+url_c%2C+url_l%2C+url_o&per_page=${per_page}&format=json&nojsoncallback=1&page=${page + 1}`;
      Axios.get(url)
      .then(res => {
        this.setState({
          images: [...this.state.images,...res.data.photos.photo],
          isLoading: false,
          page: res.data.photos.page,
          hasMore: (res.data.photos.page * per_page) < res.data.photos.total
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          isLoading: false,
          hasMore: false
        })
      })
    })
  }

  loadMore() {
    if(!this.state.isLoading) {
      this.loadImages(this.state.page)
    }
  }

  componentDidMount() {
    this.loadImages(this.state.page);
  }

  _onRefresh() {
    this.setState({
      page: 0,
      images: [],
      isLoading: true
    }, () => {
      this.loadImages(0)
    })
  }

  caculateHeight(width, height) {
    let ratio = (0.9 * Dimensions.get('window').width) / width;
    return height * ratio;
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y
      >= contentSize.height - 200;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="blue"
          barStyle="dark-content"
        />
        <View style={styles.toolBar}>
          <Text style={styles.textToolbar}>Flickr</Text>
        </View>
        <View style={styles.images}>
          <ScrollView
            style={styles.images}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this._onRefresh.bind(this)}
              />}
            onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent) && this.state.hasMore) {  
                this.loadMore();
              }
            }}
            >
            {this.state.images.map((item, index) => {
              return (
                <View style={styles.item} key={index}>
                  <Text style={styles.itemAuthor}>{item.ownername}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.description._content !== "" && <Text style={styles.itemDescription}>"{item.description._content}"</Text>}
                  <Image
                    style={styles.itemImage}
                    source={{ uri: item[size_photo.url] }}
                    height={this.caculateHeight(item[size_photo.width], item[size_photo.height])}
                  />
                </View>
              )
            })}
            {this.state.isLoading && <Text style={{ textAlign: "center", fontSize: 20 }}>Loading...</Text>}
            {!this.state.hasMore && <Text style={{ textAlign: "center", fontSize: 20 }}>No more item!</Text>}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 30
  },
  toolBar: {
    height: 50,
    backgroundColor: '#000',
  },
  textToolbar: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    padding: 5
  },
  images: {
    flex: 1,
    height: 1000,
    backgroundColor: "#C4C4C4",
    position: "relative"
  },
  item: {
    width: "100%",
    height: "auto",
    marginTop: 10,
    marginBottom: 10,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  itemImage: {
    flex: 1
  },
  itemAuthor: {
    fontSize: 20,
    fontWeight: "bold"
  },
  itemTitle: {
    marginBottom: 2,
    fontSize: 17
  },
  itemDescription: {
    fontStyle: "italic"
  }
});
