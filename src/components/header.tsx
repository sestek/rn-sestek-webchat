import React, { type FC } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import type { PropsHeaderComponent } from "src/types";


const HeaderComponent: FC<PropsHeaderComponent> = (props) => {

    return (
        <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
                <Text style={{ flex: 1, paddingLeft: 10, textAlignVertical: 'center', color: 'white', fontWeight: 'bold', fontSize: 18 }}>
                    {props.headerText}
                </Text>
            </View>
            <TouchableOpacity onPress={() => props.closeModal(old => !old)}>
                <Image style={{ width: 20, height: 20, margin: 5 }} source={require('../image/minus.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }}>
                <Image style={{ width: 20, height: 20, margin: 5 }} source={require('../image/multiply.png')} />
            </TouchableOpacity>
        </View>
    )
}

HeaderComponent.defaultProps = {
    headerText: "SESBOT"
}

export default HeaderComponent;