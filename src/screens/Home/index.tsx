import React, { useState, useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Profile } from '../../components/Profile';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListHeader } from '../../components/ListHeader';
import { Appointments, AppointmentsProps } from '../../components/Appointments';
import { ListDivider } from '../../components/ListDivider';
import { Background } from '../../components/Background';
import { Load } from '../../components/Load';

import { styles } from './style'
import { COLLECTION_APPOINTMENTS } from '../../configs/database';

export function Home() {

    const [category, setCategory] = useState('')
    const [appointments, setAppointments] = useState<AppointmentsProps[]>([])
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()

    function handleCategorySelect(categoryId: string) {
        categoryId === category ? setCategory('') : setCategory(categoryId)
    }

    function handleAppointmentsDetails(guildSelected: AppointmentsProps) {
        navigation.navigate('AppointmentsDetails', { guildSelected })
    }

    function handleAppointmentsCreate() {
        navigation.navigate('AppointmentsCreate')
    }

    async function loadAppointments() {
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS)

        const storage: AppointmentsProps[] = response ? JSON.parse(response) : []

        if (category) {
            setAppointments(storage.filter(item => item.category === category))
        } else {
            setAppointments(storage)
        }
        setLoading(false)
    }

    useFocusEffect(useCallback(() => {
        loadAppointments()
    }, [category]))

    return (
        <Background>
            <View style={styles.header}>
                <Profile />
                <ButtonAdd onPress={handleAppointmentsCreate} />
            </View>
            <CategorySelect
                categorySelected={category}
                setCategory={handleCategorySelect}
            />

            {
                loading ? <Load /> :

                    <>
                        <ListHeader
                            title="Partidas agendadas"
                            subtitle={`Total ${appointments.length}`}
                        />

                        <FlatList
                            data={appointments.reverse()}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Appointments
                                    data={item}
                                    onPress={() => handleAppointmentsDetails(item)}
                                />
                            )}
                            ItemSeparatorComponent={() => <ListDivider />}
                            style={styles.matches}
                            showsVerticalScrollIndicator={false}
                        />

                    </>

            }
        </Background>
    );
};
