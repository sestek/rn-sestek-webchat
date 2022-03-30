import React, { FC } from 'react';
import styles from './style';
import Avatar from './avatar';
import { View, Text } from 'react-native';
import { format } from 'timeago.js';
import type PropsMessageBoxComponent from 'src/types/propsMessageBoxComponent.js';

const MessageBox: FC<PropsMessageBoxComponent> = (props) => {

    var positionCls = [
        styles.rceMbox,
        props.position === 'right' && styles.rceMboxRight,
    ];
    var thatAbsoluteTime = props.type !== 'text' && props.type !== 'file' && !(props.type === 'location' && props.text);

    return (
        <View style={styles.rceContainerMbox}>

            {
                props.type === 'system' ?
                    null
                    :
                    <View
                        style={[
                            positionCls,
                        ]}>
                        <View
                            style={styles.rceMboxBody}>
                            {
                                (props.title || props.avatar) &&
                                <View
                                    style={[
                                        styles.rceMboxTitle,
                                        props.type === 'text' && styles.rceMboxTitleClear,
                                    ]}
                                >
                                    {
                                        props.avatar &&
                                        <View
                                            style={styles.rceMboxTitleAvatar}>
                                            <Avatar
                                                width={30}
                                                height={30}
                                                src={props.avatar}
                                            />
                                        </View>
                                    }
                                    <View>
                                        {
                                            props.title &&
                                            <Text
                                                style={[
                                                    styles.rceMboxTitleText,
                                                    { color: props.titleColor || 'black' },
                                                ]}>{props.title}</Text>
                                        }
                                    </View>
                                </View>
                            }

                            {
                                props.type === 'text' &&
                                <Text
                                    style={styles.rceMboxText}>
                                    {props.text}
                                    {'\t\t\t\t\t'}
                                </Text>
                            }

                            <View
                                style={[
                                    styles.rceMboxTime,
                                    thatAbsoluteTime && styles.rceMboxTimeBlock
                                ]}>
                                <Text
                                    style={styles.rceMboxTimeText}>
                                    {
                                        props.date &&
                                        (
                                            props.dateString ||
                                            format(props.date)
                                        )
                                    }
                                </Text>
                            </View>
                        </View>
                    </View>
            }
        </View>
    );
}

MessageBox.defaultProps = {
    position: 'left',
    type: 'text',
    text: '',
    title: 'SYSTEM',
    titleColor: 'black',
    date: new Date(),
    data: {},
    forwarded: false,
    dateString: '',
    notch: true,
    avatar: null,
    renderAddCmp: null,
};

export default MessageBox;