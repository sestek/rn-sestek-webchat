import React, { FC, useRef } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import type { PropsBodyComponent } from 'src/types';
import { styles } from './body-style';
import MessageBox from './messageBox';
import { RobotIcon } from '../image';

const BodyComponent: FC<PropsBodyComponent> = (props) => {

    const scrollView = useRef(null);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollView}
                onContentSizeChange={() => scrollView?.current?.scrollToEnd({ animated: true })}
            >
                {props.messageList.map((x: any, key: number) =>
                    <MessageBox
                        {...props}
                        key={key}
                        position={x.channel ? 'left' : 'right'}
                        type={'text'}
                        activity={x}
                        status={null}
                        avatar={RobotIcon}
                        renderAddCmp={undefined}
                    />)}
            </ScrollView>
        </SafeAreaView>
    )
}

export default BodyComponent;