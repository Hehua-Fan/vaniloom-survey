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
  name: z.string().min(1, 'Please enter your name'),
  emailUsername: z.string().min(1, 'Please enter email username'),
  emailDomain: z.string().min(1, 'Please select email type'),
  contact: z.string().min(1, 'Please enter your phone or WeChat'),
  age: z.string().min(1, 'Please select your age'),
  gender: z.string().min(1, 'Please select your gender'),
  orientation: z.string().min(1, 'Please select your sexual orientation'),
  ao3Content: z.string().optional(),
  favoriteCpTags: z.string().optional(),
  identity: z.array(z.string()).min(1, 'Please select at least one identity'),
  otherIdentity: z.string().optional(),
  acceptFollowUp: z.string().min(1, 'Please select whether you accept follow-up interviews'),
})

type FormData = z.infer<typeof formSchema>

const ageOptions = [
  { value: 'under-12', label: 'Under 12' },
  { value: '12-17', label: '12-17' },
  { value: '18-22', label: '18-22' },
  { value: '23-28', label: '23-28' },
  { value: '29-34', label: '29-34' },
  { value: '35-plus', label: '35 and above' },
  { value: 'prefer-not-say', label: 'Prefer not to say' },
]

const genderOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
]

const orientationOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'both', label: 'Both' },
  { value: 'other', label: 'Other' },
]

const identityOptions = [
  { value: 'reader', label: 'Reader' },
  { value: 'creator', label: 'Creator' },
  { value: 'professional', label: 'Industry Professional (please specify position)' },
  { value: 'investor', label: 'Investor' },
  { value: 'other', label: 'Other (please specify)' },
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

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
      otherIdentity: '',
      acceptFollowUp: '',
    },
  })

  // Watch identity values to show conditional input
  const identityValues = form.watch('identity')
  const showOtherInput = identityValues?.includes('other') || identityValues?.includes('professional')

  async function onSubmit(values: FormData) {
    setIsSubmitting(true)
    try {
      // Combine full email address
      const email = `${values.emailUsername}@${values.emailDomain}`
      
      // Create submission data with full email address
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
        setSubmittedEmail(email)
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
            <span>Discover your favorite CPs and content</span>
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
          Let's create a world where even niche CPs can thrive!
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
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                1. What should we call you?
              </FormLabel>
              <FormControl>
                <Input placeholder="Please enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Email */}
        <div className="space-y-4">
          <FormLabel className="text-lg font-medium flex items-center">
            <span className="text-red-500 mr-1">*</span>
            2. Email for receiving beta account
          </FormLabel>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="emailUsername"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Enter email username" {...field} />
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
                        <SelectValue placeholder="Select email type" />
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

        {/* 3. Contact */}
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                3. Your phone number/WeChat (for beta testing only)
              </FormLabel>
              <FormControl>
                <Input placeholder="Please enter your phone number or WeChat" {...field} />
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
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                4. Your age
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
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                5. Your gender
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

        {/* 6. Sexual orientation */}
        <FormField
          control={form.control}
          name="orientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                6. Your sexual orientation (for beta research only, sorry if this seems intrusive!)
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

        {/* 7. AO3 content (optional) */}
        <FormField
          control={form.control}
          name="ao3Content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                7. What were the last 3 things you read on AO3? What time of day did you read them?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your recent AO3 reading content and times (optional)"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 8. Favorite CP and tags (optional) */}
        <FormField
          control={form.control}
          name="favoriteCpTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                8. What are your favorite CPs and tags on AO3 or other fanfiction platforms? Feel free to recommend niche ones too!
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please share your favorite CPs and tags (optional)"
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
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                9. Your identity [Multiple choice]
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
                      <FormLabel className="text-sm font-medium text-gray-600">
                        {identityValues?.includes('professional') ? 'Please specify your position' : 'Please specify other identity'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            identityValues?.includes('professional') 
                              ? "e.g.: Product Manager, Designer, Engineer, etc." 
                              : "Please describe your identity in detail"
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

        {/* 10. Follow-up interview */}
        <FormField
          control={form.control}
          name="acceptFollowUp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center">
                <span className="text-red-500 mr-1">*</span>
                10. Are you willing to accept online follow-up interviews from our development team? (WeChat or online meeting)
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
                      Yes, willing to accept follow-up interviews
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="followup-no" />
                    <label htmlFor="followup-no" className="cursor-pointer">
                      No, not willing to accept follow-up interviews
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thank you message */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-800 text-lg font-medium mb-2">
            Thank you so much for participating in Vaniloom's early beta design! Let's create a world where even niche CPs can thrive! 🎉
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