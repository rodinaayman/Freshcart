import { Card, CardContent } from '@/components/ui/card';

import { FaTruck, FaRedo, FaShieldAlt, FaHeadset } from 'react-icons/fa'; 

const features = [
  {
    icon: FaTruck,
    title: 'Free Shipping',
    description: 'Orders over 500EGP',
    iconColor: 'text-blue-500',      
    bgColor: 'bg-blue-100',          
  },
  {
    icon: FaShieldAlt, 
    title: 'Secure Payment',
    description: 'Transactions 100% safe',
    iconColor: 'text-[#25c95e]',       
    bgColor: 'bg-green-100',
  },
  {
    icon: FaRedo, 
    title: 'Easy Returns',
    description: '14 days return policy',
    iconColor: 'text-orange-600',      
    bgColor: 'bg-orange-100',
  },
  {
    icon: FaHeadset, 
    title: '24/7 Support',
    description: 'Dedicated support team',
    iconColor: 'text-purple-500',     
    bgColor: 'bg-purple-100',
  },
];

export default function Features() {
  return (
    <section className="py-12 bg-[#f9fafb]"> 
      <div className=" mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="
                border-none 
                bg-white 
                shadow-none 
                rounded-xl 
                p-3 
                cursor-pointer 
                transition-all 
                duration-300 
                hover:-translate-y-1 
                hover:shadow-lg
              "
            >
              <CardContent className="p-3 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-4">
                
                <div className={`p-3 rounded-full w-fit ${feature.bgColor}`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 ">
                    {feature.description}
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </section>
  );
}