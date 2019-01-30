import * as React from "react";

import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  SectionList
} from "react-native";

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
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff"
  },
  recContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8
  },
  recItem: {
    flex: 1,
    alignItems: "center"
  },
  section: {
    margin: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 1,
    backgroundColor: "#fff"
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff"
  },
  hotItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    paddingRight: 25,
    paddingBottom: 5,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#e2e2e2"
  },
  itemRight: {
    flexDirection: "column",
    justifyContent: "space-around",
    paddingLeft: 8
  },
  updateDate: {
    color: "#ff8040"
  }
});

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
      hotData: [
        {
          _id: 13,
          id: 3714,
          title: "飞剑问道",
          author: "我吃西红柿",
          sort: "xiuzhen",
          cover: "https://m.biquke.com/files/article/image/3/3714/3714s.jpg",
          info:
            " 在这个世界，有狐仙、河神、水怪、大妖，也有求长生的修行者。 修行者们， 开法眼，可看妖魔鬼怪。 炼一口飞剑，可千里杀敌。 千里眼、顺风耳，更可探查四方。 …… 秦府二公子‘秦云’，便是一位修行者……",
          views: 59056269,
          sequence: 3,
          status: "连载中",
          uploadDate: "2019-01-20T11:36:12.000Z",
          updateDate: "2019-01-17T19:42:22.000Z",
          firstSection: 2166271,
          lastSection: 2872632,
          dayvisit: 1,
          weekvisit: 1,
          monthvisit: 1,
          weekvote: 4,
          monthvote: 2,
          allvote: 1,
          goodnum: 0,
          size: 0,
          goodnew: 0,
          createdAt: "2019-01-20T11:36:12.000Z",
          updatedAt: "2019-01-20T11:36:12.000Z"
        },
        {
          _id: 35,
          id: 34900,
          title: "圣墟",
          author: "辰东",
          sort: "xuanhuan",
          cover: "https://m.biquke.com/files/article/image/34/34900/34900s.jpg",
          info:
            " 在破败中崛起，在寂灭中复苏。 沧海成尘，雷电枯竭，那一缕幽雾又一次临近大地，世间的枷锁被打开了，一个全新的世界就此揭开神秘的一角……",
          views: 58588350,
          sequence: 34,
          status: "连载中",
          uploadDate: "2019-01-20T11:36:12.000Z",
          updateDate: "2019-01-18T09:49:55.000Z",
          firstSection: 9901964,
          lastSection: 9901983,
          dayvisit: 0,
          weekvisit: 0,
          monthvisit: 0,
          weekvote: 0,
          monthvote: 0,
          allvote: 7,
          goodnum: 4,
          size: 0,
          goodnew: 0,
          createdAt: "2019-01-20T11:36:12.000Z",
          updatedAt: "2019-01-23T18:21:33.000Z"
        },
        {
          _id: 143,
          id: 606,
          title: "完美世界",
          author: "辰东",
          sort: "xuanhuan",
          cover: "https://www.biquke.com/files/article/image/0/606/606s.jpg",
          info:
            " 一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。 群雄并起，万族林立，诸圣争霸，乱天动地。问苍茫大地，谁主沉浮？！ 一个少年从大荒中走出，一切从这里开始……",
          views: 13000000,
          sequence: 0,
          status: "连载中",
          uploadDate: "2019-01-24T12:36:40.000Z",
          updateDate: "2017-08-10T13:44:51.000Z",
          firstSection: null,
          lastSection: null,
          dayvisit: 0,
          weekvisit: 0,
          monthvisit: 0,
          weekvote: 0,
          monthvote: 0,
          allvote: 0,
          goodnum: 0,
          size: 0,
          goodnew: 0,
          createdAt: "2019-01-24T12:36:40.000Z",
          updatedAt: "2019-01-24T12:36:40.000Z"
        }
      ]
    };
  }

  public renderSectionHeader = info => {
    const title = info.section.title;
    return (
      <View style={styles.sectionHeader}>
        <Text>{title}</Text>
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
          style={{ width: 120, height: 150 }}
          source={{
            uri: item.cover
          }}
        />
        <Text>{item.title}</Text>
      </View>
    );
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
            <Text>{item.title}</Text>
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
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>
                {item.title}
                &nbsp; - &nbsp;
                <Text>{item.author}</Text>
              </Text>
              <Text style={styles.updateDate}>
                {this.moment(item.updateDate)}
              </Text>
            </View>
            <Text numberOfLines={1} ellipsizeMode={"tail"}>
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
          <Text>全本</Text>
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
              data: this.state.hotData,
              renderItem: overrideRenderRecentItem
            }
          ]}
          keyExtractor={(item, index) => item.id + index}
        />
      </View>
    );
  }
}

export default Index;
