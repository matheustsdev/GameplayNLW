import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'

import { Background } from '../../components/Background';
import { Header } from '../../components/Header';
import { CategorySelect } from '../../components/CategorySelect';
import { GuildIcon } from '../../components/GuildIcon';
import { SmallInput } from '../../components/SmallInput';
import { TextArea } from '../../components/TextArea';
import { Button } from '../../components/Button';
import { ModalView } from '../../components/Modal';
import { Guilds } from '../Guilds';
import { GuildProps } from '../../components/Guild';

import { styles } from './styles'
import { theme } from '../../global/styles/theme';
import { COLLECTION_APPOINTMENTS, } from '../../configs/database';
import { useNavigation } from '@react-navigation/native';

export function AppointmentsCreate() {
    const [category, setCategory] = useState('')
    const [openGuilds, setOpenGuilds] = useState(false)
    const [guild, setGuild] = useState<GuildProps>({} as GuildProps)

    const [day, setDay] = useState('')
    const [month, setMonth] = useState('')
    const [hour, setHour] = useState('')
    const [minute, setMinute] = useState('')
    const [description, setDescription] = useState('')

    const navigation = useNavigation()

    function handleOpenGuilds() {
        setOpenGuilds(true)
    }

    function handleCloseGuilds() {
        setOpenGuilds(false)
    }

    function handleGuildSelect(guildSelect: GuildProps) {
        setGuild(guildSelect)
        setOpenGuilds(false)
    }

    function handleCategorySelect(categoryId: string) {
        setCategory(categoryId)
    }

    async function handleSave() {
        const newAppointment = {
            id: uuid.v4(),
            guild,
            category,
            date: `${day}/${month} às ${hour}:${minute}h`,
            description
        }

        const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS)
        const appointments = storage ? JSON.parse(storage) : []

        await AsyncStorage.setItem(
            COLLECTION_APPOINTMENTS,
            JSON.stringify([...appointments, newAppointment])
        )

        navigation.navigate('Home')

    }

    

    
    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >

            <ScrollView>
                <Background >

                    <Header
                        title="Agendar partida"
                    />

                    <Text style={
                        [styles.label,
                        {
                            marginLeft: 24, marginTop: 36
                        }]}

                    >
                        Categoria
                    </Text>
                    <CategorySelect
                        hasCheckBox
                        setCategory={handleCategorySelect}
                        categorySelected={category}
                    />
                    <View style={styles.form}>
                        <RectButton
                            onPress={handleOpenGuilds}
                        >

                            <View style={styles.select} >

                                {
                                    guild.icon
                                        ? <GuildIcon guildId={guild.id} iconId={guild.icon} />
                                        : <View style={styles.image} />

                                }

                                <View style={styles.selectBody}>
                                    <Text style={styles.label}>
                                        {guild.name
                                            ? guild.name
                                            : 'Selecione um servidor'}
                                    </Text>

                                </View>

                                <Feather
                                    name='chevron-right'
                                    color={theme.colors.heading}
                                    size={18}
                                />

                            </View>

                        </RectButton>

                        <View style={styles.field} >
                            <View>
                                <Text style={[styles.label, { marginBottom: 12 }]}>
                                    Dia e mês
                                </Text>

                                <View style={styles.column} >
                                    <SmallInput
                                        onChangeText={setDay}
                                    />
                                    <Text style={styles.divider}>
                                        /
                                    </Text>
                                    <SmallInput
                                        onChangeText={setMonth}
                                    />

                                </View>
                            </View>

                            <View>
                                <Text style={[styles.label, { marginBottom: 12 }]}>
                                    Hora e minuto
                                </Text>

                                <View style={styles.column} >
                                    <SmallInput
                                        onChangeText={setHour}
                                    />
                                    <Text style={styles.divider}>
                                        :
                                    </Text>
                                    <SmallInput
                                        onChangeText={setMinute}
                                    />

                                </View>
                            </View>
                        </View>

                        <View style={[styles.field, { marginBottom: 12 }]}>
                            <Text style={styles.label}>
                                Descrição
                            </Text>

                            <Text style={styles.textLimit}>
                                Max 100 caracteres
                            </Text>
                        </View>

                        <TextArea
                            multiline
                            numberOfLines={5}
                            autoCorrect={false}
                            onChangeText={setDescription}
                        />
                        <View style={styles.footer}>
                            <Button
                                title="Agendar"
                                onPress={handleSave}
                            />
                        </View>
                    </View>
                </Background>
            </ScrollView>
            <ModalView
                visible={openGuilds}
                onDismiss={() => setOpenGuilds(false)}
                closeModal={handleCloseGuilds}
            >
                <Guilds handleGuildSelect={handleGuildSelect} />
            </ModalView>
        </KeyboardAvoidingView>
    );
};