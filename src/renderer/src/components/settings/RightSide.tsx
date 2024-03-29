/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Save } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  downloadDataFromOnlineDatabase,
  getAllSavedDataOfUser,
  saveDataToOnlineDatabase
} from '../../functions/data'
import { Data_Type, User_Type } from '../../models/types'
import { Message_Forms } from '../../models/message'
import { langFormat } from '../../functions/langFormat'
import { useGetAllMoney } from '../../hooks/money'
import { useGetClients } from '../../hooks/client'
import { useGetProductsInStorage } from '../../hooks/storage'
import { useGetRefunds } from '../../hooks/refunds'
import { useGetShops } from '../../hooks/shop'
import { useGetSaledProducts } from '../../hooks/sale'
import toast from 'react-hot-toast'

function RightSide(): JSX.Element {
  const { refetch: refetchMoney } = useGetAllMoney()
  const { refetch: refetchClients } = useGetClients()
  const { refetch: refetchProducts } = useGetProductsInStorage()
  const { refetch: refetchRefunds } = useGetRefunds()
  const { refetch: refetchShops } = useGetShops()
  const { refetch: refetchSaledProducts } = useGetSaledProducts()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const [isEntring, setIsEntring] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [errorDuringEnter, setErrorDuringEnter] = useState<string>('')
  const [data, setData] = useState<Data_Type[]>([])
  const [errorDuringSave, setErrorDuringSave] = useState<string>('')
  const [errorDuringLoad, setErrorDuringLoad] = useState<string>('')

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '')
  }, [])

  const handleEnter = async () => {
    if (!username || !password) {
      setErrorDuringEnter(
        langFormat({
          uzb: 'Login va parol kiritish shart',
          en: 'Enter username and password',
          ru: 'Введите логин и пароль'
        })
      )
      return
    }

    // check internet connection
    if (!navigator.onLine) {
      setErrorDuringEnter(
        langFormat({
          uzb: 'Internet aloqasi yoq',
          en: 'No internet connection',
          ru: 'Нет подключения к интернету'
        })
      )
      return
    }
    setErrorDuringEnter('')

    const user: User_Type = {
      email: username,
      password: password
    }

    setIsEntring(true)
    localStorage.setItem('username', username)

    getAllSavedDataOfUser(user).then((allData) => {
      if (allData === Message_Forms.ERROR) {
        setErrorDuringEnter(
          langFormat({
            uzb: 'Bunday foydalanuvchi topilmadi',
            en: 'User not found',
            ru: 'Пользователь не найден'
          })
        )

        setIsEntring(false)
        return
      }

      if (allData === Message_Forms.NOT_FOUND) {
        setErrorDuringEnter(
          langFormat({
            uzb: 'Bunday foydalanuvchi topilmadi',
            en: 'User not found',
            ru: 'Пользователь не найден'
          })
        )
        setIsEntring(false)
        return
      }

      const data: Data_Type[] = allData
      setData(data)
      setIsEntring(false)
      setIsOpened(true)
    })
  }

  const handleSaveData = async () => {
    if (!username || !password) {
      setErrorDuringEnter(
        langFormat({
          uzb: 'Login va parol kiritish shart',
          en: 'Enter username and password',
          ru: 'Введите логин и пароль'
        })
      )
      return
    }

    setErrorDuringSave('')
    setErrorDuringEnter('')

    const user: User_Type = {
      email: username,
      password: password
    }

    setIsSaving(true)
    const result = await saveDataToOnlineDatabase(user)

    if (result === Message_Forms.SUCCESS) {
      await handleEnter()
    }

    if (result === Message_Forms.ERROR) {
      setErrorDuringSave(langFormat({ uzb: 'Nimadur xato ketdi', en: 'Error', ru: 'Ошибка' }))
    }

    if (result === Message_Forms.NOT_FOUND) {
      setErrorDuringSave(
        langFormat({
          uzb: 'Bunday foydalanuvchi topilmadi',
          en: 'User not found',
          ru: 'Пользователь не найден'
        })
      )
    }

    setIsSaving(false)
  }

  const downloadDataFromDatabase = async (data: Data_Type) => {
    setErrorDuringLoad('')
    setIsDownloading(true)
    const result: Message_Forms = await downloadDataFromOnlineDatabase(data)

    if (result === Message_Forms.ERROR) {
      setErrorDuringLoad(langFormat({ uzb: 'Nimadur xato ketdi', en: 'Error', ru: 'Ошибка' }))
    }

    if (result === Message_Forms.SUCCESS) {
      refetchClients()
      refetchShops()
      refetchProducts()
      refetchMoney()
      refetchSaledProducts()
      refetchRefunds()
    }

    setIsDownloading(false)
    toast.success(
      langFormat({
        uzb: "Ma'lumot saqlandi",
        en: 'Data saved',
        ru: 'Данные сохранены'
      })
    )
    window.location.reload()
  }

  useEffect(() => {
    return () => {
      // window.location.reload();
    }
  }, [])

  return (
    <Box>
      {isOpened ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            p: 2,
            height: '100%',
            width: '100%'
          }}
        >
          <Typography variant="h6" fontWeight={'bold'}>
            {langFormat({
              uzb: "Saqlangan ma'lumotlar",
              en: ' Saved data',
              ru: ' Сохраненные данные'
            })}
          </Typography>
          <List
            disablePadding
            sx={{
              width: '100%',
              border: '1px solid',
              borderColor: 'primary.main',
              p: 1
            }}
          >
            {data?.map((data, index) => (
              <ListItemButton
                disableTouchRipple
                key={data.date}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <Typography fontWeight={'bold'}>{index + 1}.</Typography>{' '}
                <Typography sx={{ mr: 'auto', ml: 5 }}>
                  {new Date(data.date).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
                </Typography>
                <Typography sx={{ mr: 'auto', ml: 5 }}>
                  {(+Buffer.byteLength(JSON.stringify(data)) / 1048576).toFixed(3)}{' '}
                  {langFormat({ uzb: 'MB', en: 'MB', ru: 'МБ' })}
                </Typography>
                <Tooltip title="Yuklash">
                  <IconButton
                    onClick={async () => {
                      toast((t) => (
                        <Box>
                          <div>
                            {langFormat({
                              uzb: "Bu ma'lumotlarni saqlaysizmi?",
                              en: 'Do you want to download this data?',
                              ru: 'Вы хотите скачать эти данные?'
                            })}
                          </div>
                          <br />
                          <Button onClick={() => toast.dismiss(t.id)}>
                            {langFormat({ uzb: 'Bekor qilish', en: 'Cancel', ru: 'Отмена' })}
                          </Button>
                          <Button
                            color="error"
                            onClick={async () => {
                              toast.dismiss(t.id)
                              await toast.promise(downloadDataFromDatabase(data), {
                                loading: langFormat({
                                  uzb: 'Yuklanmoqda',
                                  en: 'Downloading',
                                  ru: 'Загрузка'
                                }),
                                success: langFormat({
                                  uzb: 'Yuklandi',
                                  en: 'Downloaded',
                                  ru: 'Скачано'
                                }),
                                error: langFormat({
                                  uzb: 'Yuklashda xatolik',
                                  en: 'Download error',
                                  ru: 'Ошибка загрузки'
                                })
                              })
                            }}
                          >
                            {langFormat({ uzb: 'Yuklash', en: 'Download', ru: 'Скачать' })}
                          </Button>
                        </Box>
                      ))
                    }}
                  >
                    <Save color="action" />
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            ))}
            {!data?.length && (
              <Typography fontWeight={'bold'}>
                {langFormat({
                  uzb: "Ma'lumotlar mavjud emas",
                  en: 'No data',
                  ru: 'Нет данных'
                })}
              </Typography>
            )}
          </List>
          <Button
            disabled={isSaving || isEntring}
            startIcon={(isSaving || isEntring) && <CircularProgress />}
            onClick={() => handleSaveData()}
            sx={{ width: '300px' }}
            variant="contained"
          >
            {langFormat({
              uzb: 'Hozirgi datani saqlash',
              en: 'Save current data',
              ru: 'Сохранить текущие данные'
            })}
          </Button>
          <Typography color="error">
            {(!!errorDuringSave || !!errorDuringLoad) && (errorDuringSave || errorDuringLoad)}
            {isDownloading &&
              langFormat({
                uzb: 'Yuklanmoqda...',
                en: 'Downloading...',
                ru: 'Загрузка...'
              })}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            p: 2,
            alignItems: 'center'
          }}
        >
          <Typography variant="h6">
            {langFormat({
              uzb: "Internet Bazaga ulanish uchun o'z ma'lumotlaringizni kiritishingiz shart!",
              en: 'Enter your data to login to the Internet Database!',
              ru: 'Введитейте свои данные для входа в Интернет Базу Данных!'
            })}
          </Typography>
          <TextField
            label={langFormat({
              uzb: 'Foydalanuvchi nomi',
              en: 'User name',
              ru: 'Имя пользователя'
            })}
            required
            variant="standard"
            size="small"
            sx={{ width: '500px' }}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onFocus={() => {
              setErrorDuringEnter('')
            }}
          />
          <TextField
            label={langFormat({ uzb: 'Parol', en: 'Password', ru: 'Пароль' })}
            required
            variant="standard"
            size="small"
            sx={{ width: '500px' }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            onFocus={() => {
              setErrorDuringEnter('')
            }}
          />
          <Button
            disabled={isEntring}
            startIcon={isEntring ? <CircularProgress /> : null}
            onClick={handleEnter}
            sx={{ width: '500px' }}
            variant="contained"
          >
            {langFormat({ uzb: 'Kirish', en: 'Login', ru: 'Вход' })}
          </Button>
          <Typography color="error">{!!errorDuringEnter && errorDuringEnter}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default RightSide
