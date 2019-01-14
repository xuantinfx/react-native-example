import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
import { api_key } from '../config'
import Axios from 'axios';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            isLoading: true,
        }
    }

    static navigationOptions = {
        title: 'Detail Photo',
        headerStyle: {
            backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    loadImage(id) {
        this.setState({
            isLoading: true
        }, () => {
            let url = `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${api_key}&photo_id=${id}&format=json&nojsoncallback=1`;
            Axios.get(url)
                .then(res => {
                    this.setState({
                        info: res.data.photo,
                        isLoading: false
                    })
                })
                .catch(err => {
                    console.error(JSON.stringify(err))
                    this.setState({
                        isLoading: false
                    })
                })
        })
    }

    onClickTag(tag) {
        this.props.navigation.navigate("Tags", {tag})
    }

    caculateHeight(width, height) {
        let ratio = (Dimensions.get('window').width) / width;
        return height * ratio;
    }

    componentDidMount() {
        let id = this.props.navigation.getParam('id', null);
        this.loadImage(id);
    }

    render() {
        let { navigation } = this.props;
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
                {this.state.isLoading && <Text style={{textAlign: "center", fontSize: 20}}>Loading...</Text>}
                {!this.state.isLoading && <ScrollView>
                    <View style={styles.item}>
                        <Image
                            style={styles.itemImage}
                            source={{ uri: navigation.getParam('uriPhoto',"")}}
                            height={this.caculateHeight(navigation.getParam('width', 0), navigation.getParam('height', 0))}
                        />
                        <View style={styles.info}>
                            <Text style={styles.itemAuthor}>{this.state.info.owner.realname}</Text>
                            <Text style={styles.itemNickName}>@{this.state.info.owner.username}</Text>
                            <Text style={styles.itemTitle}>{this.state.info.title._content}</Text>
                            {this.state.info.description._content !== "" && <Text style={styles.itemDescription}>"{this.state.info.description._content}"</Text>}
                            <View>
                                <Text style={styles.tagsTitle}>{"Tags"}</Text>
                                <ScrollView horizontal={true}>
                                    <View style={styles.listTags}>
                                        {this.state.info.tags.tag.map((tag, index) => {
                                            return <View style={styles.tag} key={index} onTouchEnd={() => this.onClickTag(tag._content)}>
                                                <Text style={styles.tagContent}>{tag._content}</Text></View>
                                        })}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </ScrollView>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        marginBottom: 20
    },
    item: {
        width: "100%",
    },
    itemImage: {
        width: "100%"
    },
    info: {
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    itemAuthor: {
        fontSize: 20,
        fontWeight: "bold"
    },
    itemNickName: {
        fontStyle: "italic"
    },
    itemTitle: {
        marginBottom: 2,
        fontSize: 17,
        fontStyle: "italic",
        fontWeight: "bold"
    },
    itemDescription: {
        fontStyle: "italic"
    },
    tagsTitle: {
        fontWeight: "bold",
        fontSize: 17
    },
    listTags: {
        flex: 1,
        flexDirection: "row"
    },
    tag: {
        padding: 10,
        backgroundColor: '#686B78',
        marginRight: 2
    },
    tagContent: {
        color: "#fff",
    }
});
