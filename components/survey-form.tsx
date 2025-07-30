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
  name: z.string().min(1, 'Please enter your nickname'),
  email: z.string().email('Please enter a valid email address'),
  acceptFollowUp: z.string().min(1, 'Please select whether you accept follow-up interviews'),
  age: z.string().min(1, 'Please select your age'),
  gender: z.string().min(1, 'Please select your gender identity'),
  genderSelfDescribe: z.string().optional(),
  orientation: z.string().min(1, 'Please select your sexual orientation'),
  orientationSelfDescribe: z.string().optional(),
  ao3Content: z.string().optional(),
  favoriteCpTags: z.string().optional(),
  identity: z.array(z.string()).min(1, 'Please select at least one identity'),
  otherIdentity: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const ageOptions = [
  { value: 'under-12', label: 'Under 12' },
  { value: '12-17', label: '12–17' },
  { value: '18-22', label: '18–22' },
  { value: '23-28', label: '23–28' },
  { value: '29-34', label: '29–34' },
  { value: '35-plus', label: '35 or older' },
  { value: 'prefer-not-say', label: 'Prefer not to say' },
]

const genderOptions = [
  { value: 'agender', label: 'Agender' },
  { value: 'genderqueer', label: 'Genderqueer / Gender‑fluid' },
  { value: 'man', label: 'Man' },
  { value: 'non-binary', label: 'Non‑binary' },
  { value: 'trans-man', label: 'Trans man' },
  { value: 'trans-woman', label: 'Trans woman' },
  { value: 'two-spirit', label: 'Two‑Spirit' },
  { value: 'woman', label: 'Woman' },
  { value: 'questioning', label: 'Questioning / Unsure' },
  { value: 'self-describe', label: 'Prefer to self‑describe' },
  { value: 'prefer-not-answer', label: 'Prefer not to answer' },
]

const orientationOptions = [
  { value: 'asexual', label: 'Asexual' },
  { value: 'bisexual', label: 'Bisexual' },
  { value: 'gay', label: 'Gay' },
  { value: 'lesbian', label: 'Lesbian' },
  { value: 'pansexual', label: 'Pansexual' },
  { value: 'queer', label: 'Queer' },
  { value: 'straight', label: 'Straight / Heterosexual' },
  { value: 'questioning', label: 'Questioning / Unsure' },
  { value: 'self-describe', label: 'Prefer to self‑describe' },
  { value: 'prefer-not-answer', label: 'Prefer not to answer' },
]

const identityOptions = [
  { value: 'reader', label: 'Reader' },
  { value: 'creator', label: 'Creator' },
  { value: 'professional', label: 'Industry professional (please specify your job)' },
  { value: 'investor', label: 'Investor' },
  { value: 'other', label: 'Other (please specify)' },
]

export default function SurveyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      acceptFollowUp: '',
      age: '',
      gender: '',
      genderSelfDescribe: '',
      orientation: '',
      orientationSelfDescribe: '',
      ao3Content: '',
      favoriteCpTags: '',
      identity: [],
      otherIdentity: '',
    },
  })

  // Watch values to show conditional inputs
  const identityValues = form.watch('identity')
  const genderValue = form.watch('gender')
  const orientationValue = form.watch('orientation')
  
  const showOtherInput = identityValues?.includes('other') || identityValues?.includes('professional')
  const showGenderSelfDescribe = genderValue === 'self-describe'
  const showOrientationSelfDescribe = orientationValue === 'self-describe'

  async function onSubmit(values: FormData) {
    setIsSubmitting(true)
    try {
      // Create submission data
      const submitData = {
        name: values.name,
        email: values.email,
        contact: '', // Not collected in new form
        age: values.age,
        gender: values.gender === 'self-describe' ? (values.genderSelfDescribe || '') : values.gender,
        orientation: values.orientation === 'self-describe' ? (values.orientationSelfDescribe || '') : values.orientation,
        ao3Content: values.ao3Content || '',
        favoriteCpTags: values.favoriteCpTags || '',
        identity: values.identity,
        otherIdentity: values.otherIdentity || '',
        acceptFollowUp: values.acceptFollowUp,
      }

      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        // Submission successful, switch to success state
        setSubmittedEmail(values.email)
        setIsSubmitted(true)
        toast.success('Survey submitted successfully! Beta account will be sent to your email')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Submission failed, please try again')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Submission failed, please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success page component
  const SuccessPage = () => (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
      </div>

      {/* Success title */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          🎉 Submission Successful!
        </h1>
        <p className="text-xl text-gray-600">
          Thank you for joining the Vaniloom beta!
        </p>
      </div>

      {/* Detailed information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-center space-x-2 text-blue-800">
          <Mail className="w-5 h-5" />
          <span className="font-medium">Beta account being sent</span>
        </div>
        <p className="text-blue-700">
          Your beta account will be sent to: <span className="font-mono font-medium">{submittedEmail}</span>
        </p>
        <p className="text-sm text-blue-600">
          Please check your email. If you don't receive it, please check your spam folder
        </p>
      </div>

      {/* What's next */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-3">
        <h3 className="text-lg font-semibold text-purple-800">
          🌟 What's next?
        </h3>
        <ul className="text-left text-purple-700 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Check your email for beta account information</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Use the account to log in to Vaniloom and start exploring</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Discover your favorite ships and content</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-purple-500 mt-1">•</span>
            <span>Give us feedback to help improve the product</span>
          </li>
        </ul>
      </div>

      {/* Thank you message */}
      <div className="space-y-4">
        <p className="text-lg text-gray-700">
          Let's work together to create a world where even the rarest ships can thrive!
        </p>
        <p className="text-sm text-gray-500">
          If you have any questions, please contact our support team
        </p>
      </div>
    </div>
  )

  // If submitted successfully, show success page
  if (isSubmitted) {
    return <SuccessPage />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                1. How should we address you?
              </FormLabel>
              <FormControl>
                <Input placeholder="NickName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                2. Email for receiving internal test account:
              </FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 3. Follow-up interview */}
        <FormField
          control={form.control}
          name="acceptFollowUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                3. Are you willing to accept follow-up interviews from our develop teams by email?
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">
                If not, you won't receive any emails except one to inform your testing account.
              </p>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="followup-yes" />
                    <label htmlFor="followup-yes" className="cursor-pointer">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="followup-no" />
                    <label htmlFor="followup-no" className="cursor-pointer">
                      No
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 4. Age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                4. Your age:
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

        {/* 5. Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                5. How would you describe your current gender identity?
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">
                We ask this to ensure Vaniloom serves readers of every identity; your responses are confidential and analysed only in aggregate.
              </p>
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
              
              {/* Self-describe input for gender */}
              {showGenderSelfDescribe && (
                <FormField
                  control={form.control}
                  name="genderSelfDescribe"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <Input
                          placeholder="Please describe your gender identity"
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

        {/* 6. Sexual orientation */}
        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                6. How would you describe your sexual orientation?
              </FormLabel>
              <p className="text-sm text-gray-600 mb-3">
                We ask this to ensure Vaniloom serves readers of every identity; your responses are confidential and analysed only in aggregate.
              </p>
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
              
              {/* Self-describe input for orientation */}
              {showOrientationSelfDescribe && (
                <FormField
                  control={form.control}
                  name="orientationSelfDescribe"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <Input
                          placeholder="Please describe your sexual orientation"
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

        {/* 7. AO3 content (optional) */}
        <FormField
          control={form.control}
          name="ao3Content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                7. What were the last 3 works you read on AO3? At what time of day did you read them?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your recent AO3 reading (optional)"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 8. Favorite ships and tags (optional) */}
        <FormField
          control={form.control}
          name="favoriteCpTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                8. What are your favorite ships and tags on AO3 or other fanfiction/derivative platforms? Feel free to share niche/rare ones too!
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please share your favorite ships and tags (optional)"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 9. Identity */}
        <FormField
          control={form.control}
          name="identity"
          render={() => (
            <FormItem>
              <FormLabel className="text-lg font-medium">
                9. Your identity (Multiple choice)
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
              
              {/* Dynamic "other" input field */}
              {showOtherInput && (
                <FormField
                  control={form.control}
                  name="otherIdentity"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <Input
                          placeholder={
                            identityValues?.includes('professional') 
                              ? "Please specify your job (e.g.: Product Manager, Designer, Engineer, etc.)" 
                              : "Please specify your identity"
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

        {/* Thank you message */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-medium">
            Thank you so much for participating in the early internal test of Vaniloom! Let's work together to create a world where even the rarest ships can thrive! 🎉
          </p>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-3 text-lg font-medium"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 