import { Dimensions, StatusBar, StyleSheet} from 'react-native'

const singleCarStyles = StyleSheet.create({

    whiteWrapper: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'flex-start',
        position:'relative',
        backgroundColor:'white',
        width:'100%',
        paddingBottom: 0,
    },
    autoTitle: {
        fontSize:20,
        color:'#424A55',
        fontWeight: '600',
        marginBottom:8
    },
    autoDescription: {
        fontSize:16,
        color:'#424A55',
        marginBottom:15,
        lineHeight:24
    },
    autoPrice: {
        fontSize:20,
        color:'#424A55',
        fontWeight: 'normal',
        marginBottom: 20
    },
    autoAddress: {
        fontSize:15,
        color:'#8B94A3',
        fontWeight: 'normal',
        marginBottom:40
    },
    autoDate: {
        fontSize:15,
        color:'#8B94A3',
        fontWeight: 'normal',
        // marginBottom:8
    },

    infoLabelWrapper: {
        width:180,
        marginRight:20
    },
    infoLabel: {
        fontSize:16,
        color:'#8B94A3'
    },
    infoValue: {
        marginRight:41,
        fontSize:16,
        color:'#424A55'
    },
    infoWrapper: {
        width:'100%',
        height:'auto',
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
        marginBottom:17
    },
    callButton:{
        width: "45%",
        height:50,
        borderRadius:8
    },
    callButtonToch:{
        alignSelf: 'stretch',
        flex: 1,
        alignItems:'center',
        justifyContent:"center",
        flexDirection: 'row',
    },
    writeUser:{
        width: "45%",
        height:50,
        borderRadius:8
    },
    writeUserToch:{
        alignSelf: 'stretch',
        flex: 1,
        alignItems:'center',
        justifyContent:"center",
        flexDirection: 'row',
    },
    actionButtonsWrapper: {
        width:"100%",
        height:60,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent:"space-between",
        marginTop:15,
        paddingHorizontal: 20
    },
    userWrapper: {
        width:"100%",
        height:60,
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent:"flex-start",
        marginBottom:40
    },
    userImageWrapper:{
        width:50,
        height:50,

        marginRight:15
    },
    userImage:{
        width:'100%',
        height:'100%',
        borderRadius: 35,
    },

    userName:{
        color:'#424A55',
        fontSize:16,
        marginBottom:10
    },
    postCount:{
        color:'#34BE7C',
        fontSize:12,
        fontWeight:'bold'
    },
    settingView: {
        width: 190,
        height: 70,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#F0F4F8',
        position: "absolute",
        right: 20,
        zIndex: 10,
        top: StatusBar.currentHeight + 10,
        borderColor:'silver',
        borderWidth: 1
    },

    loader: {

    }

});

export {singleCarStyles};
