import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useRouter } from 'expo-router/src'
import * as SecureStore from 'expo-secure-store'
import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'
import { useEffect } from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg_blur.png'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import Stripes from '../src/assets/stripes.svg'
import { api } from '../src/lib/api'

const StyledStripes = styled(Stripes)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/ebf860f495e4aa12d034',
}

export default function App() {
  const router = useRouter()

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'ebf860f495e4aa12d034',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })
    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{
        position: 'absolute',
        left: '-110%',
      }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="felx-1 items-center justify-center gap-6">
        <NLWLogo />
      </View>

      <View className="space-y-2">
        <Text className="text-center font-title text-2xl leading-tight text-gray-50">
          Sua cápsula do tempo
        </Text>
        <Text className="text-center font-body text-base leading-relaxed text-gray-100">
          Colecione momentos marcantes da sua jornada e compartilhe (se quiser)
          com o mundo!
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembranças
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com ❤️ no NLW da Rockeseat
      </Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}
