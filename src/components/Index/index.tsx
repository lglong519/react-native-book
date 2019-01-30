import * as React from "react";

import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  SectionList
} from "react-native";

export interface Props {
  //
}

export interface State {
  //
}

class Index extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      enthusiasmLevel: props.enthusiasmLevel || 1,
	  hotData: [],
	  recentData:[]
    };
  }
  static navigationOptions = {
    title: 'Welcome',
  };
  public renderSectionHeader = info => {
    const title = info.section.title;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.colorEm}>{title}</Text>
      </View>
    );
  };

  public moment = (time: string | number) => {
    const time = new Date(time);
    const month = this.pad(time.getMonth() + 1);
    const date = this.pad(new Date(time).getDate());
    const hours = this.pad(new Date(time).getHours());
    const minutes = this.pad(new Date(time).getMinutes());
    return `${month}-${date} ${hours}:${minutes}`;
  };
  public pad = (value: string | number) => {
    return Number(value) < 10 ? "0" + value : value;
  };
  
  public renderRecSubCell(item, index) {
    return (
      <View key={index} style={styles.recItem}>
        <Image
          style={{ width: 100, height: 130 }}
          source={{
            uri: item.cover
          }}
        />
        <Text>{item.title}</Text>
      </View>
    );
  }
  public fetchData() {
    fetch("http://dev.mofunc.com/ws/books/")
      .then(response => response.json())
      .then(results => {
        this.setState({
			hotData:results
		})
      })
      .catch(error => {
        console.error(error);
	  });
	  fetch("http://dev.mofunc.com/ws/books/?sort=-updatedAt")
      .then(response => response.json())
      .then(results => {
        this.setState({
			recentData:results
		})
      })
      .catch(error => {
        console.error(error);
      });
  }
  public componentDidMount() {
    this.fetchData();
  }
  public render() {
    const overrideRenderRecBox = ({ item }) => (
      <View style={styles.recContent}>
        {item.map((data, i) => this.renderRecSubCell(data, i))}
      </View>
    );
    const overrideRenderHotItem = ({
      item,
      index,
      section: { title, data }
    }) => {
      return (
        <View key={index} style={styles.hotItem}>
          <Image
            style={{ width: 35, height: 50 }}
            source={{ uri: item.cover }}
          />
          <View style={styles.itemRight}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.colorEm}>{item.title}</Text>
              <Text>
                <Text style={styles.colorOrg}>{item.views}</Text>
                人在看
              </Text>
            </View>
            <Text>作者: {item.author}</Text>
            <Text numberOfLines={1} ellipsizeMode={"tail"}>
              {item.info}
            </Text>
          </View>
        </View>
      );
    };
    const overrideRenderRecentItem = ({
      item,
      index,
      section: { title, data }
    }) => {
      return (
        <View key={index} style={styles.hotItem}>
          <Text style={{ alignSelf: "flex-start" }}>{index + 1}.</Text>
          <View style={{flex:1}}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={styles.colorEm}>
                {item.title}
                &nbsp; - &nbsp;
                <Text>{item.author}</Text>
              </Text>
              <Text style={styles.colorOrg}>
                {this.moment(item.updateDate)}
              </Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode={"tail"} style={{marginTop:5}}>
			{item.info}
            </Text>
          </View>
        </View>
      );
    };
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.btns}>首页</Text>
          <Text style={styles.btns}>MoFunc</Text>
          <Text style={styles.btns}>书架</Text>
        </View>
        <View style={styles.nav}>
          <Text>首页</Text>
          <Text>分类</Text>
          <Text>排行</Text>
          <Text>完本</Text>
        </View>

        <SectionList
          style={styles.section}
          renderItem={({ item, index, section }) => (
            <Text key={index}>{item}</Text>
          )}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            {
              title: "本站推荐",
              data: [this.state.hotData.slice(0, 3)],
              renderItem: overrideRenderRecBox
            }
          ]}
          keyExtractor={(item, index) => item.id + index}
        />
        <SectionList
          style={styles.section}
          renderItem={({ item, index, section }) => (
            <Text key={index}>{item}</Text>
          )}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            {
              title: "热门推荐",
              data: this.state.hotData,
              renderItem: overrideRenderHotItem
            }
          ]}
          keyExtractor={(item, index) => item.id + index}
        />
        <SectionList
          style={styles.section}
          renderItem={({ item, index, section }) => (
            <Text key={index}>{item}</Text>
          )}
          renderSectionHeader={this.renderSectionHeader}
          sections={[
            {
              title: "最近更新",
              data: this.state.recentData,
              renderItem: overrideRenderRecentItem
            }
          ]}
          keyExtractor={(item, index) => item.id + index}
        />
		<View style={styles.footer}>
          <Text style={styles.footerItem}>首页</Text>
          <Text style={styles.footerItem}>书架</Text>
        </View>
      </View>
    );
  }
}


// styles
const styles = StyleSheet.create({
	header: {
	  alignSelf: "stretch",
	  display: "flex",
	  justifyContent: "space-between",
	  alignItems: "center",
	  flexDirection: "row",
	  height: 40,
	  backgroundColor: "#1abc9c",
	  paddingLeft: 10,
	  paddingRight: 10
	},
	btns: {
	  color: "#fff"
	},
	nav: {
	  alignSelf: "stretch",
	  display: "flex",
	  justifyContent: "space-around",
	  alignItems: "center",
	  flexDirection: "row",
	  height: 40,
	  borderBottomWidth: 0.8,
	  borderBottomColor: "#ccc",
	  backgroundColor: "#fff"
	},
	recContent: {
	  flexDirection: "row",
	  justifyContent: "space-between",
	  paddingTop: 8,
	  paddingBottom: 8
	},
	recItem: {
	  flex: 1,
	  alignItems: "center"
	},
	section: {
	  margin: 5,
	  // borderStyle: "solid",
	  // borderWidth: 1,
	  // borderColor: "#ccc",
	  // borderRadius: 1,
	  backgroundColor: "#fff"
	},
	sectionHeader: {
	  flexDirection: "row",
	  alignItems: "center",
	  height: 30,
	  paddingLeft: 10,
	  borderBottomWidth: 0.5,
	  borderBottomColor: "#ccc",
	  backgroundColor: "#fff",
	},
	hotItem: {
	  flexDirection: "row",
	  alignItems: "center",
	  paddingLeft: 8,
	  paddingRight: 10,
	  paddingBottom: 5,
	  paddingTop: 5,
	  borderBottomWidth: 0.5,
	  borderColor: "#e2e2e2"
	},
	itemRight: {
	  flexDirection: "column",
	  justifyContent: "space-around",
	  paddingLeft: 8,
	  paddingRight: 35
	},
	colorOrg: {
	  color: "#ff8040"
	},
	colorEm:{
		color:'#333',
	},
	footer:{
	  flexDirection: "row",
	  alignItems: "center",
	  justifyContent: "center",
	  marginTop:15,
	  marginBottom:20,
	},
	footerItem:{
		marginRight:10,
		marginLeft:10,
	}
  });
  

export default Index;
