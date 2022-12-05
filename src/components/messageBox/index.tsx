import React, { FC, useState } from 'react';
import styles from './style';
import Avatar from './avatar';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import type PropsMessageBoxComponent from 'src/types/propsMessageBoxComponent.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AudioComponent from './audio';
import Markdown from '../../plugin/markdown/index';
import { Recorder } from '../../services';

const MessageBox: FC<PropsMessageBoxComponent> = (props) => {

    const { messageBoxColor, messageColor } = props.customizeConfiguration;

    const [activeSlide, setActiveSlide] = useState<number>(0);
    const changeActiveSlide = (number: number) => setActiveSlide(number);

    var positionCls = [
        styles.rceMbox,
        props.position === 'right' && styles.rceMboxRight,
        messageColor ? { backgroundColor: messageColor } : {}
    ];
    var thatAbsoluteTime = props.type !== 'text' && props.type !== 'file' && !(props.type === 'location' && (props.activity.text || props.activity.message));


    const onPressButton = (text?: string) => {
        props.sendMessage(text);
        props.changeInputData("");
    }

    const renderItemMessage = () => {
        return (
            <>
                {Array.isArray(props.activity?.attachments) && props.activity?.attachments[0]?.content?.images?.map((image: any, index: number) =>
                    <Image key={index} source={{ uri: image.url }} style={{ width: '100%', height: 300, marginBottom: 10, backgroundColor: 'red' }} />
                )}

                {(props.type === 'text' || props.type === 'message') &&
                    <Markdown style={styles.rceMboxText}>
                        {props.activity.text || props.activity.message}
                        {'\t\t\t\t\t'}
                    </Markdown>}

                {Array.isArray(props.activity?.attachments) && props.activity?.attachments[0]?.content?.buttons?.map((button: any, index: number) =>
                    <TouchableOpacity
                        key={index}
                        onPress={() => onPressButton(button?.value || button?.title)}
                        style={[styles.rceMButton, messageBoxColor ? { backgroundColor: messageBoxColor } : {}]}
                    >
                        <Text style={styles.rceMButtonText}>{button?.title}</Text>
                    </TouchableOpacity>
                )}
            </>
        );
    }

    const renderItemCarousel = ({ item }: any) => {
        return (
            <View style={{ backgroundColor: 'white' }}>
                {item?.content?.images?.map((image: any, index: number) =>
                    <Image key={index} source={{ uri: image.url }} style={{ width: '100%', height: 300, marginBottom: 10 }} />
                )}

                {
                    item?.content?.text &&
                    <Text
                        style={styles.rceMboxText}>
                        {item?.content?.text || ""}
                        {'\t\t\t\t\t'}
                    </Text>
                }

                {item?.content?.buttons?.map((button: any, index: number) =>
                    <TouchableOpacity key={index} onPress={() => onPressButton(button?.value || button?.title)} style={styles.rceMButton}>
                        <Text style={styles.rceMButtonText}>{button?.title}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    const renderItemAudio = () => {
        if(!props.modules.AudioRecorderPlayer || !props.modules.RNFS){
            return null;
        }

        let url = props.activity?.message;
        if (props.activity?.channelData?.AudioFromTts?.Data) url = props.activity.channelData.AudioFromTts.Data;
        return (
            <>
                <AudioComponent url={url && url.length > 1000 ? 'file://' + new Recorder(props.modules.AudioRecorderPlayer, props.modules.RNFS).saveLocalFileAudio(url) : url} modules={props.modules} />
            </>
        );
    }

    const renderCarouselPagination = () => {
        return (
            <Pagination
                dotsLength={props.activity?.attachments?.length || 0}
                activeDotIndex={activeSlide}
                containerStyle={{ paddingBottom: 8, paddingTop: 8 }}
                dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'black'
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
            />
        )
    }

    return (
        <View style={styles.rceContainerMbox}>
            {props.type === 'system' ? null :
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
                                    (props.type === 'text' || props.type === 'message') && styles.rceMboxTitleClear,
                                ]}
                            >
                                {
                                    props.avatar &&
                                    <View style={styles.rceMboxTitleAvatar} >
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

                        {props.activity?.attachmentLayout === "carousel" &&
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Carousel
                                            layout="tinder"
                                            data={props.activity?.attachments}
                                            renderItem={renderItemCarousel}
                                            sliderWidth={400}
                                            itemWidth={250}
                                            inactiveSlideOpacity={0}
                                            onSnapToItem={(index) => changeActiveSlide(index)}
                                        />
                                        {renderCarouselPagination()}
                                    </View>
                                </View>
                            </View>
                        }

                        {props.activity?.attachmentLayout !== "carousel" && renderItemMessage()}

                        {(props.type === "audio" || props.activity?.channelData?.AudioFromTts) && renderItemAudio()}

                        <View
                            style={[
                                thatAbsoluteTime && styles.rceMboxTimeBlock
                            ]}>
                            <Text
                                style={styles.rceMboxTimeText}>
                                {
                                    props.activity?.timestamp &&
                                    (
                                        props.dateString ||
                                        new Date(props.activity?.timestamp).toLocaleString()
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
    type: 'message',
    activity: null,
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

const customComparator = (prevProps: PropsMessageBoxComponent, nextProps: PropsMessageBoxComponent) => {
    return JSON.stringify(nextProps.activity) === JSON.stringify(prevProps.activity);
};

export default React.memo(MessageBox, customComparator);