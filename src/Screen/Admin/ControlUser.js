import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {TextInput, Button, useTheme} from 'react-native-paper';
import Header from '../../Component/Header';
import {showToast} from '../../../utils/Toast';
import RegularText from '../../customText/RegularText';

export default function ControlUser({route}) {
  const {screenName, userData} = route.params || {};
  const {userDetail,setCount} = useAuthContext();
  const theme = useTheme();
  let navigation = useNavigation();
  const [spinner, setSpinner] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
      type: userData?.diagnosis?.type || '',
      status: userData?.diagnosis?.status || '',
    },
    contactNumber: userData?.contactNumber || '',
  });

  // Handle input changes for both top-level and nested fields
  const handleInputChange = (field, value, nestedField = null) => {
    if (nestedField) {
      // Update nested fields (e.g., diagnosis type and status)
      setForm(prevForm => ({
        ...prevForm,
        [field]: {
          ...prevForm[field],
          [nestedField]: value,
        },
      }));
    } else {
      // Update top-level fields
      setForm(prevForm => ({
        ...prevForm,
        [field]: value,
      }));
    }
  };

  let IsAdmin = userDetail?.role == 'admin' ? true : false; //disable some input for admin like password,email,name,contactNumber

  let showInputs = screenName === 'Add User' || screenName === 'Edit Detail';
  let showPass = screenName === 'Edit Detail';

  // Simple validation function
  const validateForm = () => {
        //If Edit Screen then update the detail otherwise Add new user
        if (screenName == 'Edit User' || screenName == 'Edit Detail') {
          // await firestore().collection('users');
          await firestore()
            .collection('users')
            .doc(userData?.id)
            .update(defaultData);
          showToast(IsAdmin ? 'User Updated  ..' : 'Profile Updated');
          setCount(count=>count+1)
          await navigation.goBack()
        } else {
          await firestore().collection('users').add(defaultData);
          showToast('User Added  ..');
          await navigation.goBack()
        }
        setSpinner(false);
        // navigation.goBack();
      }
    })
  // Update the status in the form
  const handleStatus = status => {
  };
  const handleuserPress = () => {
    showToast("You can't change the Status");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Header screenName={screenName} />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          contentStyle={styles.inputContent}
          mode="outlined"
          keyboardType="email-address"
        />

        {errors.email && (
          <LightText style={[styles.errorText, {color: theme.colors.red}]}>
            {errors.email}
          </LightText>
        )}

        {!IsAdmin || showInputs || showPass ? (
          <>
            <TextInput
              label="Password"
              value={form.password}
              onChangeText={value => handleInputChange('password', value)}
              style={styles.input}
              contentStyle={styles.inputContent}
              mode="outlined"
              secureTextEntry
            />

            {errors.password && (
              <LightText style={[styles.errorText, {color: theme.colors.red}]}>
                {errors.password}
              </LightText>
            )}
          </>
        ) : (
          <></>
        )}

        <TextInput
          label="Contact Number"
          value={form.contactNumber}
          disabled={!showInputs}
          onChangeText={value => handleInputChange('contactNumber', value)}
          style={styles.input}
          contentStyle={styles.inputContent}
          mode="outlined"
          keyboardType="phone-pad"
        />


        <TextInput
          label="Diagnosis Type"
          contentStyle={styles.inputContent}
          mode="outlined"
        />

        {errors.diagnosisType && (
          <LightText style={[styles.errorText, {color: theme.colors.red}]}>
            {errors.diagnosisType}
          </LightText>
        )}

        {/* Diagnosis Status View */}
        <View style={styles.diagnosismainview}>
          <RegularText>Diagnosis Status</RegularText>
          <View style={styles.diagnosisStatus}>
            <TouchableOpacity
              activeOpacity={!IsAdmin ? 10 : 0.3}
              style={[
                styles.statusBtn,
                {backgroundColor: !IsAdmin ? 'grey' : theme.colors.red},
                form?.diagnosis.status === 'Positive' && {
                  borderWidth: 2,
                  borderColor: theme.colors.onBackground, // Change to the color you want for the selected border
                },
              ]}>
              <BoldText style={styles.statusText}>Positive</BoldText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={!IsAdmin ? 10 : 0.3}
              onPress={
                !IsAdmin ? handleuserPress : () => handleStatus('Negative')
              }
              style={[
                  borderColor: theme.colors.onBackground, // Change to the color you want for the selected border
                },
              ]}>
              <BoldText style={styles.statusText}>Negative</BoldText>
            </TouchableOpacity>
          </View>
        </View>

        {errors.status && (
          <LightText style={[styles.errorText, {color: theme.colors.red}]}>
            {errors.status}

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  input: {
    marginBottom: 15,
  },
  inputContent: {
    fontFamily: 'Sora-Regular', // Replace with the actual font family name
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    bottom: 10,
  },
  diagnosismainview: {},
  diagnosisStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  statusBtn: {
    flex: 1,
    padding: 6,
    borderRadius: 100,
  },
  statusText: {
    textAlign: 'center',
    color: '#fff',
  },
});
