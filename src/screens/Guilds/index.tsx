import React, { useState, useEffect } from 'react';
import {
    View, FlatList
} from 'react-native';

import { Guild, GuildProps } from '../../components/Guild';
import { ListDivider } from '../../components/ListDivider';
import { Load } from '../../components/Load';
import { api } from '../../services/api';

import { styles } from './styles'

type Props = {
    handleGuildSelect: (guild: GuildProps) => void
}

export function Guilds({ handleGuildSelect }: Props) {
    const [guilds, setGuilds] = useState<GuildProps[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchGuilds() {
        try {

            const response = await api.get('/users/@me/guilds')
            setLoading(false)
            setGuilds(response.data)

        } catch (error) {
            console.log(error)
        }



    }

    useEffect(() => {
        fetchGuilds();
    }, [])

    return (
        <View style={styles.container}>
            {
                loading ? <Load /> :
                    <FlatList
                        data={guilds}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <Guild
                                data={item}
                                onPress={() => handleGuildSelect(item)}
                            />
                        )}
                        ItemSeparatorComponent={() => <ListDivider isCentered />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 68, paddingTop: 103 }}
                        style={styles.guilds}
                        ListHeaderComponent={() => <ListDivider isCentered />}
                    />

            }

        </View>
    );
};