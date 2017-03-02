import React, { Component } from 'react';
import moment from 'moment';

import {
  View,
  Text,
  ListView,
  Dimensions
} from 'react-native';

import DiaryCell from './DiaryCell';

export default class Diaries extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {
          id: 4,
          body: "Love is a lie that we happily feed ourselves from generation to generation. For what, though? I don't get it. Granted, my opinion is slightly biased, I've had my heartbroken a time or two. However, the vast amounts of time in between each relationship has given me time to think on the matter.",
          created_at: moment('2017-03-01T21:52:06-08:00')
        },
        {
          id: 6,
          body: "I think memory is part choice. If you have a conversation with someone about yourself, most of the time they'll only recollect bits and pieces of whatever it was you had to say unless the information pertained to them somehow.",
          created_at: moment('2017-03-01T22:52:06-08:00')
        },
        {
          id: 5,
          body: "I suppose the answer is simple: from the beginning. I stumbled onto an old journal I used to write in when I was struggling with self-harm and self-loathing.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 6,
          body: "What is isolation? The only answer I can come up with is complete seclusion from any other human contact. Of course, the statement seems broad, but the practice of isolation and the results proceeding such is broad.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 7,
          body: "I keep dreaming of building a place where i fit in. I grew up in the south. The bible and family was the center of life. My grand father had ten children of them my father was the fifth, so i grew up surrounded by people.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 8,
          body: "I have come back since then and calmed down thinking it was the raw negative emotion but i found that it was not so. In studying the bible i found that i did not even believe the claim that a god existed. I dont know if i was forced to grow up but it hurt to lose so much all at once.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 9,
          body: "My parents fight all the time. It seems every other morning that I wake up to a meaningless, heated argument about how my dad has no respect for my mom or about how my dad is always wrong according to my mom.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 10,
          body: "I'm a 22 year old in Ann Arbor. I graduated and am spending the year applying to law school and generally just relaxing and dicking around. I'm trying this diary thing out as a way of building confidence in sharing things about myself.",
          created_at: moment('2017-03-01T23:50:58-08:00')
        },
        {
          id: 11,
          body: "A 21-year old IT student in Varazdin, Croatia. I was born in the capital, Zagreb, and have so far fucked up 2 years of university (I switched).",
          created_at: moment('2017-03-01T23:50:58-08:00')
        }
      ])
    };
  }

  render() {
    return (
      <ListView
        style={{width: Dimensions.get('window').width}}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <DiaryCell rowData={rowData} />}
      />
    );
  }
}

