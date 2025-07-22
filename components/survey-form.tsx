'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { Loader2, CheckCircle, Mail } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, '请输入您的称呼'),
  emailUsername: z.string().min(1, '请输入邮箱用户名'),
  emailDomain: z.string().min(1, '请选择邮箱类型'),
  contact: z.string().min(1, '请输入您的手机号或微信号'),
  age: z.string().min(1, '请选择您的年龄'),
  gender: z.string().min(1, '请选择您的性别'),
  orientation: z.string().min(1, '请选择您的性取向'),
  ao3Content: z.string().optional(),
  favoriteCpTags: z.string().optional(),
  identity: z.array(z.string()).min(1, '请至少选择一个身份'),
  otherIdentity: z.string().optional(), // 新增：其他身份的具体描述
  acceptFollowUp: z.string().min(1, '请选择是否愿意接受回访'), // 新增：是否接受回访
})

type FormData = z.infer<typeof formSchema>

const ageOptions = [
  { value: 'under-12', label: '12岁以下' },
  { value: '12-17', label: '12-17岁' },
  { value: '18-22', label: '18-22岁' },
  { value: '23-28', label: '23-28岁' },
  { value: '29-34', label: '29-34岁' },
  { value: '35-plus', label: '35岁及以上' },
  { value: 'prefer-not-say', label: '不愿透露' },
]

const genderOptions = [
  { value: 'female', label: '女' },
  { value: 'male', label: '男' },
  { value: 'other', label: '其他' },
]

const orientationOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'both', label: '双' },
  { value: 'other', label: '其他' },
]

const identityOptions = [
  { value: 'reader', label: '读者' },
  { value: 'creator', label: '创作者' },
  { value: 'professional', label: '相关从业者（请填写职位）' },
  { value: 'investor', label: '投资人' },
  { value: 'other', label: '其他（请填写）' },
]

const emailDomainOptions = [
  { value: 'gmail.com', label: '@gmail.com' },
  { value: 'qq.com', label: '@qq.com' },
  { value: '163.com', label: '@163.com' },
  { value: '126.com', label: '@126.com' },
  { value: 'outlook.com', label: '@outlook.com' },
  { value: 'hotmail.com', label: '@hotmail.com' },
  { value: 'yahoo.com', label: '@yahoo.com' },
  { value: 'icloud.com', label: '@icloud.com' },
  { value: 'sina.com', label: '@sina.com' },
  { value: 'sohu.com', label: '@sohu.com' },
]

export default function SurveyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false) // 新增：提交成功状态
  const [submittedEmail, setSubmittedEmail] = useState('') // 新增：记录提交的邮箱

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      emailUsername: '',
      emailDomain: 'gmail.com',
      contact: '',
      age: '',
      gender: '',
      orientation: '',
      ao3Content: '',
      favoriteCpTags: '',
      identity: [],
      otherIdentity: '', // 新增默认值
      acceptFollowUp: '', // 新增：回访选择默认值
    },
  })

  // 监听身份选择，判断是否选择了"其他"或"相关从业者"
  const identityValues = form.watch('identity')
  const showOtherInput = identityValues?.includes('other') || identityValues?.includes('professional')

  async function onSubmit(values: FormData) {
    setIsSubmitting(true)
    try {
      // 组合完整的邮箱地址
      const email = `${values.emailUsername}@${values.emailDomain}`
      
      // 创建提交数据，包含完整邮箱地址
      const submitData = {
        name: values.name,
        email: email,
        contact: values.contact,
        age: values.age,
        gender: values.gender,
        orientation: values.orientation,
        ao3Content: values.ao3Content || '',
        favoriteCpTags: values.favoriteCpTags || '',
        identity: values.identity,
        otherIdentity: values.otherIdentity || '', // 包含其他身份描述
        acceptFollowUp: values.acceptFollowUp, // 新增：是否接受回访
      }

      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        // 提交成功，切换到成功状态
        setSubmittedEmail(email)
        setIsSubmitted(true)
        toast.success('问卷提交成功！内测账号将发送到您的邮箱')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || '提交失败，请重试')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('提交失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 成功页面组件
  const SuccessPage = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
      {/* 成功图标 */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* 成功标题 */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          🎉 提交成功！
        </h1>
        <p className="text-xl text-gray-600">
          感谢您加入 Vaniloom 内测！
        </p>
      </div>

      {/* 详细信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-center space-x-2 text-blue-800">
          <Mail className="w-5 h-5" />
          <span className="font-medium">内测账号发送中</span>
        </div>
        <p className="text-blue-700">
          您的内测账号将发送到：<span className="font-mono font-medium">{submittedEmail}</span>
        </p>
        <p className="text-sm text-blue-600">
          请注意查收邮件，如果没有收到，请检查垃圾邮件文件夹
        </p>
      </div>

      {/* 温馨提示 */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-3">
        <h3 className="text-lg font-semibold text-purple-800">
          🌟 接下来该做什么？
        </h3>
        <ul className="text-left text-purple-700 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>查收邮件中的内测账号信息</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>使用账号登录 Vaniloom 开始体验</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>探索您喜欢的 CP 和内容</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>给我们反馈，帮助我们改进产品</span>
          </li>
        </ul>
      </div>

      {/* 感谢信息 */}
      <div className="space-y-4">
        <p className="text-lg text-gray-700">
          让我们一起创造一个冷门 CP 都能吃上饭的世界！
        </p>
        <p className="text-sm text-gray-500">
          如有任何问题，请联系我们的客服团队
        </p>
      </div>

      {/* 返回按钮（可选） */}
      <div className="pt-8">
        <Button
          onClick={() => {
            setIsSubmitted(false)
            form.reset()
          }}
          variant="outline"
          className="px-8 py-2"
        >
          重新填写问卷
        </Button>
      </div>
    </div>
  )

  // 如果已提交成功，显示成功页面
  if (isSubmitted) {
    return <SuccessPage />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. 称呼 */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                1. 请问老师怎么称呼？
              </FormLabel>
              <FormControl>
                <Input placeholder="请输入您的称呼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. 邮箱 */}
        <div className="space-y-4">
          <FormLabel className="text-lg font-medium flex items-center">
            <span className="text-red-500 mr-1">*</span>
            2. 用于收取内测账号的邮箱
          </FormLabel>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="emailUsername"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="请输入邮箱用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailDomain"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || 'gmail.com'}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择邮箱类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailDomainOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 3. 联系方式 */}
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                3. 您的手机号/微信号（仅用于内测调查）
              </FormLabel>
              <FormControl>
                <Input placeholder="请输入您的手机号或微信号" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4. 年龄 */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                4. 您的年龄
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {ageOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label htmlFor={option.value} className="cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 5. 性别 */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                5. 您的性别是
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {genderOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                      <label htmlFor={`gender-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 6. 性取向 */}
        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                6. 您的性取向是（仅供内测调查，如有冒犯深感抱歉！Orz）
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {orientationOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`orientation-${option.value}`} />
                      <label htmlFor={`orientation-${option.value}`} className="cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 7. ao3内容（非必填） */}
        <FormField
          control={form.control}
          name="ao3Content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                {/* 非必填，不显示红色星号 */}
                7. 您最近3次在ao3上看的内容是什么？是几点钟的时候看的？
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请详细描述您最近在ao3上的阅读内容和时间（可选）"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 8. 喜欢的cp和tags（非必填） */}
        <FormField
          control={form.control}
          name="favoriteCpTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                {/* 非必填，不显示红色星号 */}
                8. 您在ao3上或其他同人/二创平台上最喜欢的cp和tags是什么？冷门的也可以推荐给我们哦~
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请分享您喜欢的cp和tags（可选）"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 9. 身份 */}
        <FormField
          control={form.control}
          name="identity"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                9. 您的身份【多选题】
              </FormLabel>
              <div className="space-y-3">
                {identityOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="identity"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option.value])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== option.value)
                                    )
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">{option.label}</FormLabel>
                          </div>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
              
              {/* 动态显示的"其他"输入框 */}
              {showOtherInput && (
                <FormField
                  control={form.control}
                  name="otherIdentity"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-sm font-medium text-gray-600">
                        {identityValues?.includes('professional') ? '请填写具体职位' : '请填写其他身份'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            identityValues?.includes('professional') 
                              ? "例如：产品经理、设计师、工程师等" 
                              : "请详细描述您的身份"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </FormItem>
          )}
        />

        {/* 10. 线上回访 */}
        <FormField
          control={form.control}
          name="acceptFollowUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                10. 您是否愿意接受团队开发人员的线上回访？（微信或线上会议）
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="followup-yes" />
                    <label htmlFor="followup-yes" className="cursor-pointer">
                      是，愿意接受回访
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="followup-no" />
                    <label htmlFor="followup-no" className="cursor-pointer">
                      否，不愿意接受回访
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 感谢信息 */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-medium mb-2">
            非常感谢您作为早期内测用户参与Vaniloom的设计！让我们一起创造一个冷门cp都能吃上饭的世界！🎉
          </p>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 text-lg font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              '提交'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 